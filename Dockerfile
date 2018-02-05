FROM node:latest
WORKDIR /usr/src/app
RUN git clone https://github.com/papawattu/phev-controller.git
WORKDIR /usr/src/app/phev-controller
RUN npm install
EXPOSE 8081
CMD [ "npm", "start" ]