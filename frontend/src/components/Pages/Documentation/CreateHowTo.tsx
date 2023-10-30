import React from "react";

const CreateHowTo = () => {
  return (
    <div>
      <p>Use this feature to:</p>{" "}
      <ul>
        {" "}
        <li>
          {" "}
          Create decks of flashcards of various types (multiple choice,
          definitions, fill in the blanks...){" "}
        </li>{" "}
        <li>Create transcriptions, and potentially translate them</li>{" "}
        <li>Translate documents</li> <li>Summarize documents</li>{" "}
        <li>Create notes</li>{" "}
      </ul>{" "}
      <p>
        {" "}
        <strong>How it works?</strong>{" "}
      </p>
      <p>The creation process is divided into 3 parts.</p>
      <p>
        {" "}
        <strong>Choose content to process, </strong> 3 choices:{" "}
      </p>
      <ul>
        {" "}
        <li>An existing document (pdf, docx, pptx, .txt, mp3, wav)</li>{" "}
        <li>Copy/paste some text</li>{" "}
        <li>
          {" "}
          Insert a YouTube or Wikipedia link or any other webpage (You can also
          insert a series of links using a semi-colon ";" as a seperator){" "}
        </li>{" "}
      </ul>
      <p>
        {" "}
        <strong>
          {" "}
          Choose how you want to save the content(optional):{" "}
        </strong>{" "}
      </p>
      <p>
        {" "}
        Pretty straightforward, you can either choose to create a new deck or
        add it to an existing deck. If you do not choose or name a deck we will
        do that for you.{" "}
      </p>
      <p>
        {" "}
        If you do not choose any customization options the standard approach is
        to provide a series of definition and multiple choice questions.{" "}
      </p>
      <p>
        {" "}
        <strong>Customize the output (optional):</strong>{" "}
      </p>
      <p>
        {" "}
        Here you have several options, most of them should be self-explanatory.
        You do not have to use the advanced options but can do so if you want to
        try and refine your results.{" "}
      </p>
      <p>
        {" "}
        Note that the creation process for flashcards, transcriptions… is the
        same. For quizzes, once the deck is created you will be able to select
        questions from the deck and create/assign the quiz.{" "}
      </p>
      <p>
        {" "}
        <small>Notes:</small>{" "}
      </p>
      <ul>
        {" "}
        <li>
          {" "}
          <small>
            {" "}
            Once the process is launched you don’t have to remain on the page. A
            pop-up will appear notifying you when your deck is ready. If you go
            to the decks page (or refresh the decks page), you'll see your deck
            with the cards inside.{" "}
          </small>{" "}
        </li>{" "}
        <li>
          {" "}
          <small>
            {" "}
            The process can take a few minutes, depending on how busy our
            servers are and the size of the document you are processing.{" "}
          </small>{" "}
        </li>{" "}
        <li>
          {" "}
          <small>
            {" "}
            Please don't hesitate to give us feedback on the content created.{" "}
          </small>{" "}
        </li>{" "}
      </ul>
    </div>
  );
};

export { CreateHowTo };
