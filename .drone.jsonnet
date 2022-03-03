local NAME="blog-manage";
local ROOT="/drone/src";
local RUN="/data/wwwroot/" + NAME;

[
  {
    "kind": "pipeline",
    "type": "docker",
    "name": "deploy",
    "steps": [
      {
        "name": "build & copy",
        "image": "node:14",
        "volumes": [
          {
            "name": "run-conf",
            "path": RUN
          }
        ],
        "commands": [
          "yarn",
          "yarn build:prod",
          "mkdir -p "+RUN,
          "cp -rf "+ROOT+"/dist/prod/index.html "+RUN+"/index.html"
        ]
      },
      {
        "name": "notify",
        "pull": "if-not-exists",
        "image": "guoxudongdocker/drone-dingtalk:latest",
        "settings": {
          "token": {
            "from_secret": "dingtalk_token"
          },
          "type": "markdown",
          "message_color": true,
          "message_pic": true,
          "sha_link": true
        },
        "when": {
          "status": [
            "failure",
            "success"
          ]
        }
      }
    ],
    "volumes": [
      {
        "name": "run-conf",
        "host": {
          "path": RUN
        }
      }
    ]
  }
]
