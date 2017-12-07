# A common template for vue multiple page template
## 1. offer three views entries: 
 - ### home view
    - path = ${host}/home
    - render frontend SPA view
    - offer some self-adaption compontent

- ### backstage view
    - path = ${host}/admin  
    - render backstage view
    - generate CRUD page by json model config

- ### login view
    - path = ${host}/login
    - render login view

## 2. standards
  - ### follow eslint and typescript
  - ### try to follow material design

## 3. blueprint
  - ### intergrate server side and web site, generator backstage CRUD page and server CRUD Operation by one model definition
  - ### add bussiness mapping layer for website/android/ios, used to define relationship between DAO and view