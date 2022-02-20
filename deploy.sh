#online
NAME="blog-manage"
ROOT="/data/git/${NAME}"
RUN="/data/wwwroot/${NAME}"

yarn
yarn build:prod
mkdir -p ${RUN}
cp -rf ${ROOT}/dist/prod/index.html ${RUN}/index.html