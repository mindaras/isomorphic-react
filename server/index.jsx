const express = require("express");
const yields = require("express-yields");
const fs = require("fs-extra");
const webpack = require("webpack");
const { argv } = require("optimist");
const { get } = require("request-promise");
const { questions, question } = require("../data/api-real-url");
const { delay } = require("redux-saga");
const getStore = require("../src/getStore").default;
const { renderToString } = require("react-dom/server");
const { Provider } = require("react-redux");
const React = require("react");
const App = require("../src/App").default;
const { ConnectedRouter } = require("react-router-redux");
const createHistory = require("history/createMemoryHistory").default;
const path = require("path");

const port = process.env.PORT || 3000;
const app = express();

const useLiveData = argv.useLiveData === "true";
const useServerRender = argv.useServerRender === "true";

function* getQuestions() {
  let data;

  if (useLiveData) {
    data = yield get(questions, { gzip: true });
  } else {
    data = yield fs.readFile("./data/mock-questions.json", "utf-8");
  }

  return JSON.parse(data);
}

function* getQuestion(question_id) {
  let data;

  if (useLiveData) {
    data = yield get(question(question_id), { gzip: true, json: true });
  } else {
    const questions = yield getQuestions();
    const question = questions.items.find(
      _question => _question.question_id == question_id
    );
    question.body = `Mock question body: ${question_id}`;
    data = { items: [question] };
  }

  return data;
}

app.get("/api/questions", function*(req, res) {
  const data = yield getQuestions();
  yield delay(150);
  return res.json(data);
});

app.get("/api/questions/:id", function*(req, res) {
  const data = yield getQuestion(req.params.id);
  yield delay(150);
  res.json(data);
});

if (process.env.NODE_ENV === "development") {
  const config = require("../webpack.config.dev.babel").default;
  const compiler = webpack(config);

  app.use(
    require("webpack-dev-middleware")(compiler, {
      noInfo: true
    })
  );

  app.use(require("webpack-hot-middleware")(compiler));
} else {
  app.use(express.static(path.resolve(__dirname, '../dist')));
}

app.get(["/", "/questions/:id"], function*(req, res) {
  let index = yield fs.readFile("./public/index.html", "utf-8");

  const initialState = {
    questions: []
  };

  const history = createHistory({
    initialEntries: [req.path]
  });

  if (req.params.id) {
    const question_id = req.params.id;
    const response = yield getQuestion(question_id);
    const questionDetails = response.items[0];
    initialState.questions = [{ ...questionDetails }];
  } else {
    const questions = yield getQuestions();
    initialState.questions = questions.items;
  }

  const store = getStore(history, initialState);

  const questions = yield getQuestions();
  initialState.questions = questions.items;

  if (useServerRender) {
    const appRendered = renderToString(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    );

    index = index.replace("<%= preloadedApplication %>", appRendered);
  } else {
    index = index.replace(
      "<%= preloadedApplication %>",
      "Please wait while we load the application."
    );
  }

  res.send(index);
});

app.listen(port, "0.0.0.0", () => console.info(`App listening on ${port}`));
