import { Font, StyleSheet } from '@react-pdf/renderer'

// Font.register({
//     family: 'Poppins',
//     fonts: [
//         {
//             src: '../../../public/assets/fonts/Poppins-Regular.ttf',
//             fontWeight: 400,
//         },
//         {
//             src: '../../../public/assets/fonts/Poppins-Medium.ttf',
//             fontWeight: 500,
//         },
//         {
//             src: '../../../public/assets/fonts/Poppins-SemiBold.ttf',
//             fontWeight: 500,
//         },
//         {
//             src: '../../../public/assets/fonts/Poppins-Bold.ttf',
//             fontWeight: 700,
//         },
//     ],
// })

const styles = StyleSheet.create({
    image: {
        width: '80px',
        objectFit: 'contain',
    },
    page: {
        flexDirection: 'column',
        paddingVertical: 25,
        position: 'relative',
    },
    topRight: {
        position: 'absolute',
        top: 4,
        right: 4,
        zIndex: 1,
        width: '160px',
        height: '50px',
        fontSize: 12,
    },
    tagLine: {
        fontSize: 8,
        textAlign: 'left',
    },
    date: {
        fontSize: 12,
        textAlign: 'right',
    },

    topLeft: {
        position: 'absolute',
        top: 4,
        left: 4,
        width: '160px',
        height: '50px',
    },

    title: {
        fontSize: 24,
        textAlign: 'center',
        color: '#000000',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    titleSection: {
        backgroundColor: 'transparent',
        justifyContent: 'center',

        padding: 10,
        margin: 10,
        width: '100%',
        height: 100,
        color: '#000000',
    },
    Question: {
        marginBottom: 20,
    },
    Answer: {
        marginBottom: 20,
    },
    Mcq: {},
    McqHeader: {
        borderRadius: 100,
        color: '#190042',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    McqHeaderTitle: {
        fontWeight: 400,
        fontSize: 14,
        width: '90%',
    },
    McqHeaderPoints: {
        fontWeight: 600,
        fontSize: 12,
    },
    McqItem: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
        alignItems: 'center',
        borderRadius: 100,
        color: 'black',
        fontSize: 14,
    },
    // yeah I couldn't find a better name for this
    McqItemLetter: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        textAlign: 'center',
        borderRadius: 100,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        width: 22,
        fontSize: 12,
        fontWeight: 600,
        height: 22,
    },
    DefinitionDots: {
        marginTop: 15,
    },
    LineOfDots: {
        border: 'none',
        borderTop: '2px dotted #000',
        color: '#fff',
        backgroundColor: '#fff',
        opacity: 0.4,
        height: '1px',
        width: '95%',
        margin: '0px auto',
        paddingVertical: 15,
    },
    instructions: {
        fontSize: 12,
    },
})

export { styles }
export { Font }
