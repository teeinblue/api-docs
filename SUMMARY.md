# Table of contents

* ```yaml
  props:
    models: true
  type: builtin:openapi
  dependencies:
    spec:
      ref:
        kind: openapi
        spec: teeinblue-api
  ```
* ```yaml
  type: builtin:openapi
  props:
    models: true
  dependencies:
    spec:
      ref:
        kind: openapi
        spec: teeinblue-api-api
  ```
