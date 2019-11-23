FROM node:lts-slim

LABEL com.github.actions.name=""
LABEL com.github.actions.description=""
LABEL com.github.actions.icon="settings"
LABEL com.github.actions.color="green"

# avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# install additional dependencies
RUN apt-get update \
    && apt-get -y install --no-install-recommends apt-utils 2>&1 \
    && apt-get -y install --no-install-recommends apt-transport-https 2>&1 \
    && apt-get -y install wget curl lsb-release git openssh  \
    #
    && npm install -g eslint \
    #
    && apt-get autoremove -y && apt-get autoclean -y && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# switch back interactive
ENV DEBIAN_FRONTEND=dialog

COPY "functions.sh" "/functions.sh"
COPY "entrypoint.sh" "/entrypoint.sh"

ENTRYPOINT ["/entrypoint.sh"]
CMD ["help"]
