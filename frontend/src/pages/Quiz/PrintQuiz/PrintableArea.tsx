import CephaBannerOne from '@assets/logos/CephaBannerOne.png'
import {
    Document,
    Font,
    Image,
    Page,
    PDFViewer,
    StyleSheet,
    Text,
    View,
} from '@react-pdf/renderer'
import type { QuestionSchema, QuizSchema, UserSchema } from '@source/client'
import React from 'react'

import { styles } from './style'

interface PrintableAreaProps {
    questions: QuestionSchema[] | null
    quiz: QuizSchema | null
    answerKey: boolean
    includeInstructions: boolean
    includePoints: boolean
    includeName: boolean
    includeDate: boolean
    freeUser: boolean
    user: UserSchema
    qtyLines: number
}
const PrintableArea: React.FC<PrintableAreaProps> = ({
    freeUser,
    quiz,
    questions,
    answerKey,
    includeInstructions,
    includePoints,
    includeName,
    includeDate,
    qtyLines,
    user,
}) => {
    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleDateString('en-GB')
    const randomizeMCQ = (listMCQ: string[]): string[] => {
        const array = listMCQ.slice()
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
        }
        return array
    }

    return (
        <Document
            title={quiz?.name}
            author={freeUser ? 'cephadex.com' : (user.username ?? '')}
        >
            <Page size="A4" style={styles.page}>
                <View style={styles.topLeft}>
                    <Image src={CephaBannerOne.trim()} style={styles.image} />
                    <Text style={styles.tagLine}>
                        Make custom quizzes at cephadex.com
                    </Text>
                </View>
                <View style={styles.topRight}>
                    {includeDate && (
                        <Text style={styles.date}>{formattedDate}</Text>
                    )}
                    {includeName && (
                        <Text style={styles.date}>Name:__________</Text>
                    )}
                </View>
                <View style={styles.titleSection}>
                    <Text style={styles.title}>
                        {quiz?.name} {answerKey ? ' - answers' : ''}
                    </Text>
                    {includeInstructions && (
                        <Text style={styles.instructions}>
                            Instructions: {quiz?.instructions}
                        </Text>
                    )}
                </View>
                <View style={styles.section}>
                    {questions?.map((q, i) => {
                        return q.qType === 'Mcq' ? (
                            <View style={[styles.Mcq, styles.Question]} key={i}>
                                <View style={styles.McqHeader}>
                                    <Text style={styles.McqHeaderTitle}>
                                        {i + 1}) {q.term}
                                    </Text>
                                    {includePoints && (
                                        <Text style={styles.McqHeaderPoints}>
                                            /{q.points ?? 1}
                                        </Text>
                                    )}
                                </View>
                                {answerKey ? (
                                    <View>
                                        <Text style={styles.Answer}>
                                            {q.content}
                                        </Text>
                                    </View>
                                ) : (
                                    <View>
                                        {randomizeMCQ([
                                            q.content ?? '',
                                            q.boc2 ?? '',
                                            q.boc3 ?? '',
                                            q.boc4 ?? '',
                                        ]).map((boc, i) => (
                                            <View
                                                key={i}
                                                style={styles.McqItem}
                                            >
                                                <View
                                                    style={styles.McqItemLetter}
                                                >
                                                    <Text>
                                                        {String.fromCharCode(
                                                            65 + i
                                                        )}
                                                    </Text>
                                                </View>
                                                <Text>{boc}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ) : (
                            <View style={[styles.Mcq, styles.Question]} key={i}>
                                <View style={styles.McqHeader}>
                                    <Text style={styles.McqHeaderTitle}>
                                        {i + 1}) {q.term}
                                    </Text>
                                    {includePoints && (
                                        <Text style={styles.McqHeaderPoints}>
                                            /{q.points ?? 1}
                                        </Text>
                                    )}
                                </View>
                                {answerKey ? (
                                    <View>
                                        <Text> {q.content} </Text>
                                    </View>
                                ) : (
                                    <View style={styles.DefinitionDots}>
                                        {Array.from({ length: qtyLines }).map(
                                            (_, i) => (
                                                <View
                                                    key={i}
                                                    style={styles.LineOfDots}
                                                ></View>
                                            )
                                        )}
                                    </View>
                                )}
                            </View>
                        )
                    })}
                </View>
            </Page>
        </Document>
    )
}

export { PrintableArea }
