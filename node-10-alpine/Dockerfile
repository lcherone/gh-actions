FROM node:10-alpine

LABEL com.github.actions.name=""
LABEL com.github.actions.description=""
LABEL com.github.actions.icon="settings"
LABEL com.github.actions.color="green"

# install additional dependencies
RUN apk --update add git openssh bash && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*

COPY "functions.sh" "/functions.sh"
COPY "entrypoint.sh" "/entrypoint.sh"

ENTRYPOINT ["/entrypoint.sh"]
CMD ["help"]
