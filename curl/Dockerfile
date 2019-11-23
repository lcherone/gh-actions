FROM alpine:latest

LABEL com.github.actions.name=""
LABEL com.github.actions.description=""
LABEL com.github.actions.icon="settings"
LABEL com.github.actions.color="green"

# install additional dependencies
RUN apk --update --no-cache add curl

COPY "entrypoint.sh" "/entrypoint.sh"

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/usr/bin/curl --version"]
