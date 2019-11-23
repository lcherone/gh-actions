FROM alpine:latest

LABEL com.github.actions.name=""
LABEL com.github.actions.description=""
LABEL com.github.actions.icon="settings"
LABEL com.github.actions.color="green"

# install additional dependencies
RUN apk --update add curl && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*

COPY "entrypoint.sh" "/entrypoint.sh"

ENTRYPOINT ["/entrypoint.sh"]
CMD ["curl --version"]
