import { RouteProps } from "react-router-dom";
import { routes, renderPage } from './route'

export interface IRoute extends RouteProps {
  title?: string;
  name?: string;
  icon?: JSX.Element;
  child?: IRoute[]
}

export default {
  routes,
  renderPage
} 