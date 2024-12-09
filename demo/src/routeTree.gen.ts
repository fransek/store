/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as TodoImport } from './routes/todo'
import { Route as CounterImport } from './routes/counter'
import { Route as ContextImport } from './routes/context'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const TodoRoute = TodoImport.update({
  id: '/todo',
  path: '/todo',
  getParentRoute: () => rootRoute,
} as any)

const CounterRoute = CounterImport.update({
  id: '/counter',
  path: '/counter',
  getParentRoute: () => rootRoute,
} as any)

const ContextRoute = ContextImport.update({
  id: '/context',
  path: '/context',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/context': {
      id: '/context'
      path: '/context'
      fullPath: '/context'
      preLoaderRoute: typeof ContextImport
      parentRoute: typeof rootRoute
    }
    '/counter': {
      id: '/counter'
      path: '/counter'
      fullPath: '/counter'
      preLoaderRoute: typeof CounterImport
      parentRoute: typeof rootRoute
    }
    '/todo': {
      id: '/todo'
      path: '/todo'
      fullPath: '/todo'
      preLoaderRoute: typeof TodoImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/context': typeof ContextRoute
  '/counter': typeof CounterRoute
  '/todo': typeof TodoRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/context': typeof ContextRoute
  '/counter': typeof CounterRoute
  '/todo': typeof TodoRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/context': typeof ContextRoute
  '/counter': typeof CounterRoute
  '/todo': typeof TodoRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/context' | '/counter' | '/todo'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/context' | '/counter' | '/todo'
  id: '__root__' | '/' | '/context' | '/counter' | '/todo'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ContextRoute: typeof ContextRoute
  CounterRoute: typeof CounterRoute
  TodoRoute: typeof TodoRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ContextRoute: ContextRoute,
  CounterRoute: CounterRoute,
  TodoRoute: TodoRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/context",
        "/counter",
        "/todo"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/context": {
      "filePath": "context.tsx"
    },
    "/counter": {
      "filePath": "counter.tsx"
    },
    "/todo": {
      "filePath": "todo.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
