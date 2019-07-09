# MyLearningTool

This repository is one (node.js version) of the back end parts of my learning-tool project.
There are other repositories for [the front end part](https://github.com/helenawang/my-learning-tool).
The knowledge data are private now, and you can use your own question template.

## Motivation

The motivation of the whole project can be found in [the front end part repository](https://github.com/helenawang/my-learning-tool#motivation). I put it there because I started the project from the front end part, and so far I just treated this so called back end part as a bridge between data sources and the front end part.

The motivation of this repository is that one day I suddenly found I cannot save data and retrieve it later if I just have a front end !! So I tried to build a back end using java and [Spring boot](https://spring.io/projects/spring-boot), but the code is kind of complex and there is some cost of switching language. Then I thought maybe I could try using node.js to make it easier (Afterwards, I found it not easy either...).

I'm not very familiar with building a standalone server side application with node.js, and most of the time, I just use node as dev tools for building client side application. So this repository is not that well-structured now.

## Components
This back end just accepts request from the front end and communicate with data sources, which are elasticsearch and mysql (or local files) now. So there are mainly two components:
- elasticsearch client, which processes "not very" structured data like knowledge text, and make it easier to search and analysis
- mysql client, which processes "very" structured data like the question template.

## Contribute
If you have some suggestions, open an issue or email me at helnawang@hotmail.com.

## Dependencies
* [Expressjs](https://expressjs.com/)
* [Elasticsearch-client-javascript](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html)
* [mysql-client-express](https://expressjs.com/en/guide/database-integration.html#mysql)
