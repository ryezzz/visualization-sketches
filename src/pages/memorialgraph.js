// FIGURING OUT YSCALE FOR STACKED ELEMENTS

import React, { useEffect, useState, useRef } from "react";
import { graphql } from "gatsby";
import "../styles.css";

const EntryNode = (props) => (
  <div
    style={{
      backgroundColor: "rgba(0, 255, 255,.5)",
      float: "left",
      color: "white",
      border: "solid 2px white",
      padding: "1.5%",
      margin: "1.5%",
      width: "43%",
    }}
  >
    <div style={{ fontSize: "40px" }}>{props.date}</div>
    <input type="date"></input>
    <textarea></textarea>
    <button>Edit Entry</button>
    <button>Save Entry</button>

    {props.children}
  </div>
);

const Memorialgraph = ({ data }) => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <EntryNode date="2002"> This is entry text</EntryNode>
      <EntryNode date="2002">This is different entry text</EntryNode>
      <EntryNode date="2005">
        {" "}
        This is Aliqua officia qui Lorem enim sit in irure nostrud nostrud sint
        dolor eu. Culpa tempor mollit adipisicing occaecat irure amet velit
        Lorem aute laboris amet. Eu laborum id anim pariatur. Dolor tempor duis
        incididunt tempor mollit minim et enim in et exercitation. more entry
        text
      </EntryNode>
      <EntryNode date="2007"> This is entry text</EntryNode>
      <EntryNode date="2009"></EntryNode>
      <EntryNode date="2010"></EntryNode>

      <button style={{ width: "100%" }}>Add Entry</button>
    </div>
  );
};

export const query = graphql`
  query Memorialgraph {
    allDataCsv {
      edges {
        node {
          items {
            date
            formatted_date
            entry_word_count
            quarter
          }
        }
      }
    }
  }
`;

export default Memorialgraph;
