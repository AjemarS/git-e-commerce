import React from "react";
import "../App.css";

interface RenderComponentProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

export default function RenderComponent<T>(props: RenderComponentProps<T>) {
  return <div>{props.items.map(props.renderItem)}</div>;
}
