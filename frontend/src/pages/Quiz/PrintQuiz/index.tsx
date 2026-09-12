import { Document, Page, Text, View } from "@react-pdf/renderer";
import { type QuestionSchema, type QuizSchema } from "@source/client";
import React from "react";

import { Font, styles } from "./style";
// Register font

interface PrintQuizProps {
  questions: QuestionSchema[] | null;
  quiz: QuizSchema | null;
}

const randomizeMCQ = (listMCQ: string[]): string[] => {
  const array = listMCQ.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j] as string, array[i] as string];
  }
  return array;
};
export const Doc: React.FC<PrintQuizProps> = ({ quiz, questions }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>{quiz?.name}</Text>
          {questions?.map((q, i) => {
            return q.qType === "Mcq" ? (
              <View style={[styles.Mcq, styles.Question]} key={i}>
                {/* The Header */}
                <View style={styles.McqHeader}>
                  <Text style={styles.McqHeaderTitle}>
                    {i + 1}) {q.term}
                  </Text>
                  <Text style={styles.McqHeaderPoints}>/{q.points ?? 1}</Text>
                </View>
                {/*   The body */}
                <View>
                  {randomizeMCQ([
                    q.content ?? "",
                    q.boc2 ?? "",
                    q.boc3 ?? "",
                    q.boc4 ?? "",
                  ]).map((boc, i) => (
                    <View key={i} style={styles.McqItem}>
                      <View style={styles.McqItemLetter}>
                        <Text>{String.fromCharCode(65 + i)}</Text>
                      </View>
                      <Text>{boc}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View style={[styles.Mcq, styles.Question]} key={i}>
                {/* The Header */}
                <View style={styles.McqHeader}>
                  <Text style={styles.McqHeaderTitle}>
                    {i + 1}) {q.term}
                  </Text>
                  <Text style={styles.McqHeaderPoints}>/{q.points ?? 1}</Text>
                </View>
                {/*   The body */}
                <View style={styles.DefinitionDots}>
                  <View style={styles.LineOfDots}></View>
                  <View style={styles.LineOfDots}></View>
                  <View style={styles.LineOfDots}></View>
                  <View style={styles.LineOfDots}></View>
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};
