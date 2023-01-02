
# TALENTF (SocialMedia along with job features)

TALENTF is an socialmedia website , which can have two types of 
accounts (freelancers and client). The difference between both 
is that if someone sigin as a freelancers he can see the jobs which
a client has posted , who the freelancers follows. So if the freelancersis interested interested
in the work then he can send the connection request to the client. So client can accept
the one who he likes to assign the work and can chat the remaining parts. And also have
other socialmedia features like, add post, like, comment etc..

## API Reference

#### Get Landing page

```https
  GET /talentf.tk
```

For getting the landing page

#### Get login

```https
  GET /talentf.tk/signin
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key` | `string` | **Required**. Your API key        |

#### Get HomePage

```https
   GET /talentf.tk/HomePage
```

| Parameter   | Type     | Description                       |
| :--------   | :------- | :-------------------------------- |
| `JWT Token` | `string` | **Required**. Your token          |

#### Get works

```https
   GET /talentf.tk/works
```

| Parameter   | Type     | Description                       |
| :--------   | :------- | :-------------------------------- |
| `JWT Token` | `string` | **Required**. your token          |

## Run Locally

To run the project locally, clone the project

```bash
  git clone https://github.com/abhijith2213/talentf.git
```
Then, Go to project directory

```bash
cd Social-Media
```
get into client folder(React)
```bash
cd client
```
Install the dependencies
```bash
npm install
```
start the client server
```bash
npm start
```
get back to root directory
```bash
cd ..
```
Get into server directory(Node js)
```bash
cd server
```
Install the dependencies
```bash
npm install
```
start the server side
```bash
npm start
```
for starting the server side using nodemon
```bash
npm run dev
```
get back to root directory
```bash
cd ..
```

Get into socket directory
```bash
cd socket
```
Install the dependencies
```bash
npm install
```
start the socket server side
```bash
npm start
```









## 🚀 About Me
I'm a full stack developer...

## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://https://abhijith2213.github.io/personal-website/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/abhijith-a-s)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://https://twitter.com/abhijithas_123)