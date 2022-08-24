// path — встроенный в Node.js модуль
const path = require('path');
//Это плагин для Webpack, который за нас будет копировать файлы из /public в /build и туда же подкладывать бандл
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  // Указываем путь до входной точки:
  entry: './src/main.js',
  output: {
    // Путь до директории (важно использовать path.resolve):
    path: path.resolve(__dirname, 'build'),
    // Имя файла со сборкой:
    filename: 'bundle.js',
    clean: true,
  },
  devtool: 'source-map',
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'public' }],
    }),
  ],
  module: {
    rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: ['babel-loader']
        },
        {
          // Это правило будет применяться ко всем файлам,
          // имя которых подойдет под регулярное выражение:
          test: /\.css$/i,
          // Список лоадеров, которые применятся к файлу:
          use: [
            { loader: 'style-loader' },
            {
                loader: 'css-loader',
                // Лоадеру можно передать параметры:
                options: { modules: true }
            }
         ]
        }
    ]
  }
}
