# Tue-05-08-Lab-Group-2

# Co-Script

## 1 Functionalities

The achieved functionalities include: Authentication services, Script Management, File import and export, Script browsing, Online Script Editing, Script Translation, Script Generation, Script style analysis, Script emulation, Script continuation, Script rewriting, Scene illustration generation and context management. Most of the core functions are related to AI.

For detailed information of functionalities, please refer to our [Wiki](https://github.sydney.edu.au/2024ELEC5619/Tue-05-08-Lab-Group-2/wiki#1-functionalities) page.

## 2 Backend

The backend is build with spring boot framework version 3.3.3 with gradle v8.8 with Java (JDK 22).

### Libraries and Dependencies

Plugins:

`io.spring.dependency-management` version '1.1.6'

`org.springdoc.openapi-gradle-plugin` version '1.9.0'

#### Dependencies

```
    implementation 'org.springframework.boot:spring-boot-starter'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-webflux'
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.6.0'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    compileOnly 'org.projectlombok:lombok:1.18.34'
    annotationProcessor 'org.projectlombok:lombok:1.18.34'
    runtimeOnly 'com.mysql:mysql-connector-j'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.apache.httpcomponents.client5:httpclient5'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
```

### How to run the backend

- Pull from the repo `[Sign in via LDAP · GitHub](https://github.sydney.edu.au/2024ELEC5619/Tue-05-08-Lab-Group-2.git)`.

- Set up the environments:
  
  - Database: `DB_PASSWORD=wukong@3A;DB_URL=jdbc:mysql://blackstore.mysql.database.azure.com:3306/COMP5619;DB_USER=blackmyth`
  
  - API keys: `GEMINI_API_KEY=YOUR_API_KEY` and `OPENAI_API_KEY=YOUR_API_KEY`

- Initialize the database if needed (**OPTIONAL**. THIS WILL OVERWRITE THE DATA IN THE DATABASE): run `/database/init.sql`.

- Run `ProjectApplication.java` to run the backend server.

## 3 Frontend

The frontend use React framework. We use Vite ('^5.4.1') as the local development server for frontend.

### Libraries and Dependencies

```json
    "ant-design-icons": "^1.3.3",
    "antd": "^5.20.6",
    "axios": "^1.7.7",
    "draft-js": "^0.11.7",
    "highlight.js": "^11.10.0",
    "marked": "^14.1.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-markdown": "^9.0.1",
    "react-quill": "^2.0.0",
    "react-router-dom": "^6.27.0",
    "rehype-highlight": "^7.0.0",
    "rehype-raw": "^7.0.0",
    "remark-gfm": "^4.0.0",
    "styled-components": "^6.1.13"
```

#### Installation

Get into /frontend-react.

1. install node_modules: Run `npm install`
2. install react-router-dom@6 `npm install react-router-dom@6`
3. install ant-design: Run `npm install antd --save`
4. install icons package: Run `npm install ant-design-icons --save`
5. `npm install styled-components`

### How to run the frontend

Run frontend: `npm run dev`

Production version: 

- Generate production version: `npm run build`.

- Preview: `npm run preview`.
