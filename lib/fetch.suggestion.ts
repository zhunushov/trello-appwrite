import formatTodosForAI from "./format.todos.for.ai";

const fetchSuggestion = async (board: Board) => {
  try {
    const todos = formatTodosForAI(board);

    const res = await fetch("/api/generateSummary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ todos }),
    });
    const GPTdata = await res.json();
    const { content } = GPTdata;

    return content;
  } catch (error) {
    console.log(error);
  }
};

export default fetchSuggestion;
