import Foundation
import SafariServices
import Security
import os.log

final class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {
    private let accessGroup = "2YELN5S6P5.co.signetapp.app.shared"
    private let keychainService = "co.signetapp.app:no-auth"
    private let tokenKey = "signet.session.token"
    private let serverURLKey = "signet.session.server-url"

    private struct Session {
        let token: String
        let serverURL: String
    }

    func beginRequest(with context: NSExtensionContext) {
        guard
            let item = context.inputItems.first as? NSExtensionItem,
            let message = item.userInfo?[SFExtensionMessageKey] as? [String: Any],
            let action = message["action"] as? String
        else {
            complete(context, status: "invalid")
            return
        }

        switch action {
        case "getSession":
            complete(context, status: session() == nil ? "signedOut" : "ready")
        case "saveBookmark":
            guard
                let title = (message["title"] as? String)?.trimmingCharacters(in: .whitespacesAndNewlines),
                !title.isEmpty,
                let urlString = message["url"] as? String,
                isHTTPURL(urlString)
            else {
                complete(context, status: "invalid")
                return
            }
            guard let session = session() else {
                complete(context, status: "signedOut")
                return
            }

            let language = message["language"] as? String ?? "en"
            Task {
                let status = await saveBookmark(
                    title: title,
                    urlString: urlString,
                    session: session,
                    language: language
                )
                complete(context, status: status)
            }
        default:
            complete(context, status: "invalid")
        }
    }

    private func complete(_ context: NSExtensionContext, status: String) {
        let response = NSExtensionItem()
        response.userInfo = [SFExtensionMessageKey: ["status": status]]
        context.completeRequest(returningItems: [response], completionHandler: nil)
    }

    private func session() -> Session? {
        guard
            let token = sharedValue(for: tokenKey),
            let serverURL = sharedValue(for: serverURLKey),
            isHTTPURL(serverURL)
        else {
            return nil
        }
        return Session(token: token, serverURL: serverURL)
    }

    private func sharedValue(for account: String) -> String? {
        let encodedKey = Data(account.utf8)
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: encodedKey,
            kSecAttrGeneric as String: encodedKey,
            kSecAttrAccessGroup as String: accessGroup,
            kSecMatchLimit as String: kSecMatchLimitOne,
            kSecReturnData as String: true,
        ]

        var result: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        guard status == errSecSuccess, let data = result as? Data else {
            if status != errSecItemNotFound {
                os_log(.error, "Shared session Keychain read failed with status %d", status)
            }
            return nil
        }
        return String(data: data, encoding: .utf8)
    }

    private func isHTTPURL(_ value: String) -> Bool {
        guard let components = URLComponents(string: value), let scheme = components.scheme?.lowercased() else {
            return false
        }
        return (scheme == "http" || scheme == "https") && components.host?.isEmpty == false
    }

    private func request(for serverURL: String, session: Session, language: String) throws -> URLRequest {
        let baseURL = serverURL.hasSuffix("/") ? String(serverURL.dropLast()) : serverURL
        guard let url = URL(string: baseURL + "/api/v1/bookmarks") else {
            throw URLError(.badURL)
        }

        var request = URLRequest(url: url)
        request.setValue("Bearer \(session.token)", forHTTPHeaderField: "Authorization")
        request.setValue(language, forHTTPHeaderField: "Accept-Language")
        return request
    }

    private func saveBookmark(
        title: String,
        urlString: String,
        session: Session,
        language: String
    ) async -> String {
        do {
            var duplicateRequest = try request(for: session.serverURL, session: session, language: language)
            guard let duplicateURL = duplicateRequest.url,
                  var components = URLComponents(url: duplicateURL, resolvingAgainstBaseURL: false)
            else {
                return "failed"
            }
            components.queryItems = [URLQueryItem(name: "url", value: urlString)]
            duplicateRequest.url = components.url

            let configuration = URLSessionConfiguration.ephemeral
            configuration.timeoutIntervalForRequest = 15
            configuration.timeoutIntervalForResource = 30
            let urlSession = URLSession(configuration: configuration)

            let (duplicateData, duplicateResponse) = try await urlSession.data(for: duplicateRequest)
            guard let duplicateHTTPResponse = duplicateResponse as? HTTPURLResponse else {
                return "failed"
            }
            if duplicateHTTPResponse.statusCode == 401 {
                return "unauthorized"
            }
            guard duplicateHTTPResponse.statusCode == 200,
                  let list = try JSONSerialization.jsonObject(with: duplicateData) as? [String: Any],
                  let bookmarks = list["data"] as? [[String: Any]]
            else {
                return "failed"
            }
            if !bookmarks.isEmpty {
                return "duplicate"
            }

            var createRequest = try request(for: session.serverURL, session: session, language: language)
            createRequest.httpMethod = "POST"
            createRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
            createRequest.httpBody = try JSONSerialization.data(withJSONObject: [
                "title": title,
                "url": urlString,
            ])

            let (_, createResponse) = try await urlSession.data(for: createRequest)
            guard let createHTTPResponse = createResponse as? HTTPURLResponse else {
                return "failed"
            }
            if createHTTPResponse.statusCode == 401 {
                return "unauthorized"
            }
            return createHTTPResponse.statusCode == 201 ? "saved" : "failed"
        } catch let error as URLError {
            switch error.code {
            case .notConnectedToInternet, .networkConnectionLost, .dataNotAllowed:
                return "offline"
            default:
                return "failed"
            }
        } catch {
            return "failed"
        }
    }
}
