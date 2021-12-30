import React from "react";



export const scatterScrollingtext = (scrollLocation) => {
  if (scrollLocation === 2) {
    return {
      title: (
        <>
          Diary Entries by <b>week</b>
        </>
      ),
      date_selection: "week",
    };
  }

  if (scrollLocation === 1) {
    return {
      title: (
        <>
          Diary Entries by <b>month</b>
        </>
      ),
      date_selection: "month",
    };
  }

  if (scrollLocation === 0) {
    return {
      title: (
        <>
          Diary Entries by <b>year</b>
        </>
      ),
      date_selection: "year",
    };
  }

  return {
    title: (
      <>
        Diary Entries by <b>year</b>
      </>
    ),
    date_selection: "year",
  };
};


export const formatDataFunct = (dataElem) => {
  const diaryFormattedData = [];
  dataElem.forEach((d) => {
    let dObject = {
      id: d.id,
      date: d.date,
      entry_word_count: d.entry_word_count,
      formatted_date: new Date(d.formatted_date),
      month: new Date(d.formatted_date).getMonth(),
      year: new Date(d.formatted_date).getFullYear(),
      quarter: new Date(d.formatted_date).getFullYear(),
      week: new Date(d.formatted_date).getDay(),
      radius: 20,
      formatted_date: new Date(d.formatted_date),
    };
    diaryFormattedData.push(dObject);
  });
  return diaryFormattedData;
};
