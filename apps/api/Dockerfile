# syntax=docker/dockerfile:1

ARG ELIXIR_VERSION=1.18.4
ARG OTP_VERSION=28.1
ARG DEBIAN_VERSION=bookworm-20250908-slim

FROM hexpm/elixir:${ELIXIR_VERSION}-erlang-${OTP_VERSION}-debian-${DEBIAN_VERSION} AS build

RUN apt-get update \
    && apt-get install --yes --no-install-recommends build-essential git \
    && rm -rf /var/lib/apt/lists/*

# Avoid JIT W^X mapping failures when Buildx emulates a foreign architecture.
ENV MIX_ENV=prod \
    ERL_FLAGS="+JMsingle true"
WORKDIR /app

RUN mix local.hex --force && mix local.rebar --force

COPY apps/api/mix.exs apps/api/mix.lock ./
RUN mix deps.get --only prod

COPY apps/api/config/config.exs apps/api/config/prod.exs ./config/
RUN mix deps.compile

COPY apps/api/lib ./lib
COPY apps/api/priv ./priv
COPY apps/api/config/runtime.exs ./config/runtime.exs

RUN mix compile && mix release

FROM debian:${DEBIAN_VERSION} AS runtime

RUN apt-get update \
    && apt-get install --yes --no-install-recommends ca-certificates curl libncurses6 libstdc++6 openssl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system signet \
    && useradd --system --gid signet --home-dir /app --shell /usr/sbin/nologin signet

ENV LANG=C.UTF-8 \
    MIX_ENV=prod \
    PHX_SERVER=true \
    PORT=4000

WORKDIR /app
COPY --from=build --chown=signet:signet /app/_build/prod/rel/signet ./

USER signet
EXPOSE 4000

CMD ["/app/bin/signet", "start"]
