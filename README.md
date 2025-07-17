# Suitmedia Frontend

This project is built with [React](https://react.dev/) and [Tailwind CSS](https://tailwindcss.com/).

## Features

- Sort posts by **Newest** and **Oldest**
- Choose items per page: **10, 20, 50**
- Pagination with status indicator
- Consistent 4:3 thumbnail ratio
- Lazy loading for images
- Post title limited to 3 lines with ellipsis
- State persists on sort, page change, and refresh (URL sync)
- API proxy for local development

## Tech Stack

- **React** (TypeScript)
- **Tailwind CSS** (with line-clamp plugin)
- **React Router DOM**

## API

All API requests are proxied to:

```
https://suitmedia-backend.suitdev.com/api/ideas
```

**Params:**

- `page[number]`: Visited page (e.g. 1)
- `page[size]`: Items per page (e.g. 10)
- `append[]`: `small_image`, `medium_image`
- `sort`: `published_at` or `-published_at`

**Example:**

```
/api/ideas?page[number]=1&page[size]=10&append[]=small_image&append[]=medium_image&sort=-published_at
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

## Deployment

See [deployment documentation](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://react.dev/)
