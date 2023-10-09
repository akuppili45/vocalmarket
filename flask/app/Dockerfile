# syntax=docker/dockerfile:1.4
FROM --platform=$BUILDPLATFORM python:3.10-alpine AS builder

WORKDIR /app


COPY requirements.txt /app
RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install -r requirements.txt

COPY . /app

EXPOSE 5000

ENV AWS_DEFAULT_REGION us-west-2
ENV AWS_ACCESS_KEY_ID AKIAQP3CBAKPQBEZIOUW
ENV AWS_SECRET_ACCESS_KEY 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
ENV STRIPE_SECRET_KEY sk_test_51N7rZpFMuSlfDtxoojUEuQ1KpQa8U1tdBH11sgK5hTGrHST0oP4N6E6KP0qmDhhvZPIvQxBGHh0YPGWmWokv9saq00KW87CV8J
ENV STRIPE_PUBLISHABLE_KEY pk_test_51N7rZpFMuSlfDtxouB2D2A4kHmYoRmufHcWz4O5mUbgoGqbVkARjT8v5eITG8bXKZSuXJxAvKI8V1V6dXVZfgaYL00PvMSwXrB
ENV STRIPE_ENDPOINT_SECRET whsec_9c7f8a94babb7cae926759a3ebcb95bef3db806b6c9f3c71c4488d963c46f194
ENV OPENAI_API_KEY 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


ENTRYPOINT ["python3"]
CMD ["app.py"]



# FROM builder as dev-envs

# RUN <<EOF
# apk update
# apk add git
# EOF

# RUN <<EOF
# addgroup -S docker
# adduser -S --shell /bin/bash --ingroup docker vscode
# EOF

# RUN apt-get install -y curl
# # install Docker tools (cli, buildx, compose)
# COPY --from=gloursdocker/docker / /
