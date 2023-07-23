/*************************************************************************
 * This file contains the majority of customizable settings that can be 
 * manipulated to tweak the survey to your needs. 
 * NOTE: Not all settings are found here, and I have simply pulled out 
 * certain elements from the Utils.js file that are more static exports 
 * than utility functions.
 *************************************************************************/
import React from "react";
// Constant imports
import
{
    SVG_HEIGHT,
    SVG_WIDTH,
    MOBILE,
} from "./Graph";

/*************************************************************************
 * Exporting alerts and Warnings
 *************************************************************************/
export const DELETE_WARNING = "Cannot delete Nodes after linking them in the network stage!";
export const DUPLICATE_WARNING = "You already chose this name. Please modify it to be slightly different!";
export const SLIDER_WARNING = "You provided a value for every person, thank you. Click on a node to change their age!";
export const CATEGORY_WARNING = "You provided the category for every person, thank you. Click on a node to change their category!";
export const CATEGORY_CHANGED = "You have changed the category for an individual. Please ensure that any dependant subcategories are updated as well."

/*************************************************************************
 * Constants for creating alters
 *************************************************************************/
// The maximum number of individuals that participants can add.
export const MAX_ALTERS = 20

// The minimum number of alters that participants can add. Having this value higher than 0 will prevent users from 
//navigating the site and skipping the name generation screen. Participants MUST add 
//<MIN_ALTERS> individuals in order to proceed to subsequent questions.
export const MIN_ALTERS = 20


/*************************************************************************
 * Defining Box Colors to avoid repetition
 *************************************************************************/
export const BOX_COLORS = [
    "#E9621F", "#0795BB", "#F4E401", "#6D3A8A"
]

/*************************************************************************
 * Object contains the settings for Gender. You can add additional values
 * If you would like to incorperate more genders than Male, Female, and 
 * Other.
 *************************************************************************/
export const GENDER_SETTINGS = {
    female: {
        name: "female",
        color: "#C8A4DB"
    },
    male: {
        name: "male",
        color: "#FECC80"
    },
    other: {
        name: "other",
        color: "#80FED0"
    }
}

export const COLLABORATION_SETTINGS = {
    supervisor: {
        name: "supervisor",
        color: BOX_COLORS[0]
    },
    committeeMember: {
        name: "committee member",
        color: BOX_COLORS[1]
    },
    none: {
        name: "no",
        color: "#acacac"
    }
}

export const IS_LABMEMBER_SETTINGS = {
    isLabMember: {
        name: "yes",
        color: "#E9621F"
    },
    notLabMember: {
        name: "no",
        color: "#acacac"
    }
}

export const WOULD_ANSWER_SIMILAR_TO_ME_SETTINGS = {
    verySimilar: {
        name: "very similar",
        color: BOX_COLORS[0]
    },
    somewhatSimilar: {
        name: "somewhat similar",
        color: BOX_COLORS[1]
    },
    notSimilar: {
        name: "not similar",
        color: BOX_COLORS[2]
    },
    noResponse: {
        name: "NA",
        color: "#acacac"
    }
}

export const IS_DIFFICULT_TO_INTERACT_WITH = {
    veryDifficult: {
        name: "very difficult",
        color: BOX_COLORS[0]
    },
    aLittleDifficult: {
        name: "somewhat difficult",
        color: BOX_COLORS[1]
    },
    noResponse: {
        name: "NA",
        color: "#acacac"
    }
}

export const INTRODUCTION_TEXT = <div className="introduction">
    <h3>Thank you for participating in this research! Our work would not be possible without your time and thoughtful responses.</h3>
    <p>In this survey, you will construct your own personal social network! We are interested in who you interact with most frequently in your current academic role and the types of support you might receive from these individuals.</p>
    <p>Some instructions:</p>
    <ul>
        <li>
            <p>For optimal functioning and enjoyability, this survey should be completed on a tablet, laptop, or desktop computer. It is not recommended for use on a mobile device. Maximize your browser size now for optimal viewing of the survey questions. You may have to scroll down the page to see the full question if your screen size is very small. </p>
        </li>
        <li>
            <p>Once you begin, access any survey question through the menu icon at the top right corner of your page. This can be helpful if you need to go back to previous questions to make any changes. </p>
        </li>
        <li>
            <p>This survey <b><u>does not have password retrieval</u></b>. Please ensure that you can remember or access your password later. Your correct password is necessary to update your responses in six months.</p>
        </li>
    </ul>
    <p>We hope you enjoy building your personal social network!</p>
</div>

export const END_OF_SURVEY_STATEMENT = <div className="introduction">
    <h3>Thank you very much for participating!</h3>
    <p>We will contact you by email in six months to update your responses. Your GENTLE account will save all the responses you’ve recorded today, so updating responses should take minimal time.</p>
    <p>PLEASE REMEMBER! This survey <u>does not have password retrieval</u>. Ensure that you can remember or access your password later. Your correct password is necessary to update your responses in six months.</p>
</div>
/*************************************************************************
 * A constant object that defines the on-screen questions for the survey.
 * To add additional questions, simply create a new <div></div> containing 
 * the question, and add it to the array. It is important to know the 
 * location of a div when you add it to a route in Survey.
 * For Example, SURVEYQUESTIONS[1] would be the second div in the array, 
 * since arrays are 0 based.
 *************************************************************************/
export const SURVEY_QUESTIONS = [
    // Question 1 Instructions (appearing in text-box)
    <div>
        <p>
            Q1. Name 20 individuals that you interact with most frequently as a student or post-doctoral fellow. Think of individuals you interact with while conducting your research (e.g., field or lab work, lab meetings, reading clubs, seminars, classes, clubs, etc). These individuals might include supervisor(s), committee members, lab members, fellow students/classmates, summer students, professors, instructors, teaching assistants, technicians, lab managers, staff members, professional scientists, or others.
        </p>
        <p>
            *You should be able to recognize all these individuals by face or name, and they should recognize you by face or name via in person or online interactions.
        </p>
        <p>
            If you need to modify a node (rename or delete), you can click the node and press delete on the keyboard or click the Modify Selected Node button.
        </p>
    </div>,
    // Question 2 Instructions (appearing in text-box)
    <>
        <div>
            <p>
                Q2. Please select a gender for each individual.
            </p>
            <p>
                You can do this by clicking an individual to cycle through options until their color matches the appropriate gender found in the legend.
            </p>
        </div>

        <div className="legend">
            <h3>Legend</h3>
            <div className="legendNode" style={{ backgroundColor: GENDER_SETTINGS.female.color }}><p>Woman</p></div>
            <div className="legendNode" style={{ backgroundColor: GENDER_SETTINGS.male.color }}><p>Man</p></div>
            <div className="legendNode" style={{ backgroundColor: GENDER_SETTINGS.other.color }}><p>Other</p></div>
        </div>
    </>,
    // Question 3 Instructions
    <div>
        <p>
            Q3. Do your best to give an approximate age category for each individual.
        </p>
        <p>
            You can do this by clicking an individual and selecting an age bracket. If you want to remove a category from an individual, simply click them and select the option again to remove it.
        </p>
    </div>,
    // Question 4 Instructions
    <div>
        <p>
            Q4. In our society, people are often described by their race or racial background. These are not based in science, but our race may influence the way we are treated by individuals and institutions, and this may affect our well-being. Which category(ies) best describes the individuals below?
        </p>
        <p>
        You can do this by clicking an individual and selecting the appropriate category(ies). You must click the individual every time you want to add an additional category. If you want to remove a category, simply click the individual and select the option again to remove.
        </p>
    </div>,
    // Question 5a Instructions
    <div>
        <p>
            Q5a. Where do you interact with these individuals, in an academic or non-academic environment? Place everyone into either the 'academic' or 'non-academic' box.
        </p>
        <p>
            You can do this by clicking on an individual and dragging them into the appropriate box.
        </p>
    </div>,
    //Question 5b Instructions and message 
    <div>
        <p>
            Q5. Which category best describes each individual?
        </p>
        <p>
            You can do this by clicking an individual and then selecting the appropriate position below. If you want to remove a category from an individual, simply click them and select the option again to remove it.
        </p>
    </div>,
    //Question 5c Instructions message
    <div>
        <p>
            Q5c. Here are the individuals you placed in the non-academic box. Can you tell me more about each of their positions?
        </p>
        <p>
            You can do this by clicking an individual and then selecting the appropriate position below.
        </p>
    </div>,
    //Question 6 Instructions and message
    <>
        <div>
            <p>
                Q6. Select All YOUR current lab members by clicking them.
            </p>
        </div>
        <div className="legend">
            <h3>Legend</h3>
            <div className="legendNode" style={{ backgroundColor: BOX_COLORS[0] }}><p>Lab Member</p></div>
        </div>
    </>
    ,
    // Question 6 (Network linking supposed to go here, but I want to move it ot the end.)
    //Question 7
    <>
        <div>
            <p>
                Q7. If listed, select your current supervisor(s) and committee member(s) by clicking them until their color matches the legend on the right.
            </p>
        </div>
        <div className="legend">
            <h3>Legend</h3>
            <div className="legendNode" style={{ backgroundColor: BOX_COLORS[0] }}><p>Supervisor</p></div>
            <div className="legendNode" style={{ backgroundColor: BOX_COLORS[1] }}><p>Committee Member</p></div>
        </div>
    </>,
    // Question 13
    <div>
        <p>
            Q8. How comfortable are you discussing details about <u>your personal life</u> with these individuals?
        </p>
        <p>
            Click and drag individuals into the appropriate box. If you are unsure you can leave individuals outside the boxes.
        </p>
    </div>,
    // Question 14
    <div>
        <p>
            Q9. How comfortable are you listening to anyone below who wishes to discuss details about <u>their personal life</u> with you?
        </p>
        <p>
            Click and drag individuals into the appropriate box. If you are unsure you can leave individuals outside the boxes.
        </p>
    </div>,
    // Question 8
    <div>
        <p>
            Q10. Does anyone below provide or would be willing to provide <u>academic support</u> to you?
        </p>
        <p>
            <u>Academic support</u> might include things like research collaboration, offering training that develops your research skills, help with study design, field or lab work, writing, reading, class work, coding, data management, statistics, or other support related to research.
        </p>
        <p>
            Click and drag individuals into the appropriate box. If you are unsure you can leave individuals outside the boxes.
        </p>
    </div>,
    // Question 9
    <div>
        <p>
            Q11. Is there anyone you would like more technical support from?
        </p>
        <p>
            You can do this by clicking and dragging relevant individuals into the box. If you are unsure you can leave individuals outside the boxes.
        </p>
    </div>,
    // Question 10
    <div>
        <p>
            Q11. Do you provide or would be willing to provide <u>academic support</u> to anyone below?
        </p>
        <p>
            <u>Academic support</u> might include things like research collaboration, offering training that develops your research skills, help with study design, field or lab work, writing, reading, class work, coding, data management, statistics, or other support related to research.
        </p>
        <p>
            Click and drag individuals into the appropriate box. If you are unsure you can leave individuals outside the boxes.
        </p>
    </div>,
    // Question 11
    <div>
        <p>
            Q12. Do you feel comfortable talking with anyone below about <u>failure, disappointment, or struggle in your academic work?</u>
        </p>
        <p>
            Click and drag individuals into the appropriate box. If you are unsure you can leave individuals outside the boxes.
        </p>
    </div>,
    // Question 12
    <div>
        <p>
            Q13. Do you feel comfortable providing support to anyone below about <u>failure, disappointment, or struggle in their academic work?</u>
        </p>
        <p>
            Click and drag individuals into the appropriate box. If you are unsure you can leave individuals outside the boxes.
        </p>
    </div>,

    // Question 15
    <>
        <div>
            <p>
                Q14. Do you find it difficult to interact with anyone below? 
            </p>
            <p>
                If so, click those individuals until their color matches the legend on the right.
            </p>
        </div>
        <div className="legend">
            <h3>Legend</h3>
            <div className="legendNode" style={{ backgroundColor: BOX_COLORS[0] }}><p>Very Difficult</p></div>
            <div className="legendNode" style={{ backgroundColor: BOX_COLORS[1] }}><p>Somewhat difficult</p></div>
        </div>
    </>
    ,
    // Question 16
    <>
        <div>
            <p>
                Q15. How close are you to these individuals?
            </p>
            <p>
                Click individuals until their colour matches the legend on the right. If you are unsure you can leave the individual unchanged.
            </p>
        </div>
        <div className="legend">
            <h3>Legend</h3>
            <div className="legendNode" style={{ backgroundColor: BOX_COLORS[0] }}><p>Very close</p></div>
            <div className="legendNode" style={{ backgroundColor: BOX_COLORS[1] }}><p>Somewhat close</p></div>
            <div className="legendNode" style={{ backgroundColor: BOX_COLORS[2] }}><p>Not close</p></div>
        </div>
    </>
    ,
    // Question 17
    <div>
        <p>
            Q16. Excluding yourself, now link individuals that <u>provide academic support to each other</u>. For example, collaborating on research, supervising students together, help with study design, field/lab work, writing, reading, class work, coding, data management, statistics, or other support related to research.
        </p>
        <p>
            Create a link (or unlink) by <u>clicking the center</u> of an individual, and then <u>clicking the center</u> of another individual. Existing ties will turn red for the current selection. <u>Click the 'Deselect Current Node'</u> button to cancel your current selection.
        </p>
    </div>
];

/*************************************************************************
 * Template Node that represents an alter for the survey. The Node 
 * consists of a series of Key-Value pairs that make up both the Node 
 * State as well as the values that will be exported to the database to 
 * gather the survey results. 
 * You can add additional keys or modify existing keys to hold your custom 
 * survey data.
 * @param {number} counter: Esentiall the unique key representing the 
 * node.
 * @param {string} name: The Name of the Alter.
 *************************************************************************/
export function returnTemplateNode(counter, name)
{
    return {
        // State values used to control the node during execution
        key: counter,
        name: name,
        size: (MOBILE ? 20 : 30),
        fixed: false,
        float: false,
        link: false,
        fixedPosX: SVG_WIDTH / 2,
        fixedPosY: SVG_HEIGHT * 0.1 + (Math.random() * (SVG_HEIGHT * 0.8)),
        continuous1: -1,
        continuous2: -1,

        booleanCondition: false,
        x: 250,
        y: 250,
        floatX: 0,
        floatY: 0,
        shouldFloat: false,
        // Values for the purposes of data collection.
        // Name belongs in both locations, but I have chosen to leave it as a control value.
        color: "#acacac",
        sex: "",
        age: "",
        culture: [],
        // box: "",
        academic: -1,
        academicSubCategory: "",
        nonAcademicSubCategory: "",
        isLabMember: -1,
        labMemberColor: "#acacac",
        collaboration: -1,
        collaborationColor: "#acacac",
        providesMeSupport_Technical: -1,
        iWouldLikeMoreTechnicalSupport: -1,
        iProvideSupport_Technical: -1,
        iAmComfortable_Failure_Disappointment_Struggle_Academic: -1,
        iProvideSupport_Failure_Disappointment_Struggle_Academic: -1,
        iAmComfortable_Personal_NonAcademic: -1,
        iProvideSupport_Personal_NonAcademic: -1,
        difficultToInteractWith: -1,
        difficultToInteractWithColor: "#acacac",
        wouldAnswerSimilarToMe: -1,
        wouldAnswerSimilarToMeColor: "#acacac",
        categoryColor: "white",
        border: "#FFFFFF"
    };
}

/*************************************************************************
 * You Node template controls the appearance of the 'You' node.
 * Default: 
 * key: 0, name: "You", categoryColor: "green", 
 * color: "green", size: 10, x: SVGWIDTH / 2, y: SVGHEIGHT / 2,
 * floatX: SVGWIDTH / 2, floatY: SVGHEIGHT / 2, fixed: false,
 * float: false, link: false, shouldFloat: false
 *************************************************************************/
export function returnYouTemplate()
{
    return {
        key: 0,
        name: "You",
        categoryColor: "green",
        color: "green",
        size: 10,
        x: SVG_WIDTH / 2,
        y: SVG_HEIGHT / 2,
        floatX: SVG_WIDTH / 2,
        floatY: SVG_HEIGHT / 2,
        fixed: false,
        float: false,
        link: false,
        shouldFloat: false


    }
}

/*************************************************************************
 * The Informed Consent information that survey takers will agree to prior 
 * to taking the survey. 
 * TODO: This text should be replaced with an html block, to have more 
 * control over the appearance of the consent sheet.
 *************************************************************************/
export const INFORMATION = "Place-holder for informed consent sheet.";



/*************************************************************************
 * A category object that is used to define the selectable categories for 
 * a single question. This will assign node properties, colors, and text.
 * To add additional categories to this question, simply follow this 
 * format.
 * To Create another question that uses categories, you need to create 
 * an entirely new Categories object by a different name, and assign it 
 * to a key in the node using a callback function provided.
 *************************************************************************/
// export const CATEGORIES = [
//     { key: 0, text: "Cat1", color: "#E27D60" },
//     { key: 1, text: "Cat2", color: "#85DCBA" },
//     { key: 2, text: "Cat3", color: "#E8A87C" },
//     { key: 3, text: "Cat4", color: "red" }
// ];

export const ACADEMIC_SUBCATEGORIES = [
    { key: 0, text: "Undergraduate Student", color: "#FEEDB3" },
    { key: 1, text: "Masters Student", color: "#FDE4B5" },
    { key: 2, text: "PhD Student", color: "#FBDBB7" },
    { key: 3, text: "Post-doctoral Fellow", color: "#FAD4B8" },
    { key: 4, text: "Technician", color: "#F8CEB9" },
    { key: 5, text: "Instructor", color: "#F7C4BA" },
    { key: 6, text: "Professor", color: "#F6BBBB" },
    { key: 7, text: "Professional - Scientist", color: "#fEB4E3" },
    { key: 8, text: "Professional - other", color: "#F2BFEA" },
    { key: 9, text: "Other", color: "#F1B6EC" }

];

export const AGE_CATEGORIES = [
    { key: 0, text: "<20", color: "#FFE699" },
    { key: 1, text: "20-24", color: "#FFE699" },
    { key: 2, text: "25-29", color: "#FFE699" },
    { key: 3, text: "30-34", color: "#FFE699" },
    { key: 4, text: "35-39", color: "#FFE699" },
    { key: 5, text: "40-44", color: "#FFE699" },
    { key: 6, text: "45-49", color: "#FFE699" },
    { key: 7, text: "50-59", color: "#FFE699" },
    { key: 8, text: "60+", color: "#FFE699" }

];

export const CULTURAL_CATEGORIES = [
    { key: 0, text: "Black", color: "#FFE699" },
    { key: 1, text: "East Asian", color: "#FFE699" },
    { key: 2, text: "Indigenous (First Nations, Inuk/Inuit, Métis)", color: "#FFE699" },
    { key: 3, text: "Latin American", color: "#FFE699" },
    { key: 4, text: "Middle Eastern", color: "#FFE699" },
    { key: 5, text: "South Asian", color: "#FFE699" },
    { key: 6, text: "Southeast Asian", color: "#FFE699" },
    { key: 7, text: "White", color: "#FFE699" },
    { key: 8, text: "Another race, I'm not sure", color: "#FFE699" }
];

export const NONACADEMIC_SUBCATEGORIES = [
    { key: 0, text: "Professional Affiliate", color: "#CACEE7" },
    { key: 1, text: "Employer", color: "#C6D4EC" },
    { key: 2, text: "Community Member", color: "#C1DBF0" },
    { key: 3, text: "Friend", color: "#BBE4F6" },
    { key: 4, text: "Family", color: "#B5EDFC" },
    { key: 5, text: "Partner", color: "#B4FDF9" },
    { key: 6, text: "Elder", color: "#B3FFE3" },
    { key: 7, text: "Other", color: "#CAEAC8" },
];


/*************************************************************************
 * A Boxes oject used to define the drag and drop boxes for a single 
 * question.
 * To add an additional box, you will need to change the sizes and colors 
 * of the provided boxes to allow more room for boxes. 
 * To Create a new set of boxes for a seperate question, you can copy the 
 * template, and give it a new name. Then reference that object in the 
 * callback 
 *************************************************************************/

// Boxes for Q4a
export var ACADEMIC_BOXES = (window.innerWidth > 700 ?
    // desktop sized boxes.
    [
        {
            key: 0,
            text: "Academic:",
            value: "academic",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        },
        {
            key: 1,
            text: "Non-Academic:",
            value: "non-academic",
            color: BOX_COLORS[1],
            x: ((SVG_WIDTH / 3) + 15),
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        }
    ] :
    // Mobile Considerations. If the screensize is less than 700px, return the bollowing boxes
    [
        {
            key: 0,
            text: "Acedemic:",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.9 - 250 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725,
            height: window.innerHeight * 0.20
        },
        {
            key: 1,
            text: "Non-Acedemic:",
            color: BOX_COLORS[1],
            x: 15,
            y: (window.innerHeight * 0.9 - 10 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725, height: window.innerHeight * 0.20,
            height: window.innerHeight * 0.20
        }
    ]
)

// Boxes for Q5
export const LAB_MEMBER_BOX = (window.innerWidth > 700 ?
    // desktop sized boxes.
    [
        {
            key: 0,
            text: "Lab Members:",
            value: "true",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: SVG_WIDTH - 30,
            height: window.innerHeight * 0.17
        }
    ] :
    // Mobile Considerations. If the screensize is less than 700px, return the bollowing boxes
    [
        {
            key: 0,
            text: "Lab Members:",
            value: "true",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.9 - 250 - window.innerHeight * 0.20),
            width: SVG_WIDTH - 30,
            height: window.innerHeight * 0.20
        }
    ]
)

// Boxes for Q6
export const COLLABORATOR_BOXES = (window.innerWidth > 700 ?
    // desktop sized boxes.
    [
        {
            key: 0,
            text: "Supervisor(s):",
            value: "supervisors",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 2) - 15),
            height: window.innerHeight * 0.17
        },
        {
            key: 1,
            text: "Committee Member(s):",
            value: "committee member",
            color: BOX_COLORS[1],
            x: ((SVG_WIDTH / 2) + 15),
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 2) - 30),
            height: window.innerHeight * 0.17
        },
    ] :
    // Mobile Considerations. If the screensize is less than 700px, return the bollowing boxes
    [
        {
            key: 0,
            text: "I am collaborating with:",
            value: "current collaborator",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.9 - 250 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725,
            height: window.innerHeight * 0.20
        },
        {
            key: 1,
            text: "I would like to collaborate with:",
            value: "I would like to",
            color: BOX_COLORS[1],
            x: 15,
            y: (window.innerHeight * 0.9 - 10 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725, height: window.innerHeight * 0.20
        },
    ]
)

// Boxes for Question 7
export const PROVIDES_ME_TECHNICAL_SUPPORT = (window.innerWidth > 700 ?
    // desktop sized boxes.
    [
        {
            key: 0,
            text: "A lot of academic support:",
            value: "a lot of support",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        },
        {
            key: 1,
            text: "Some academic support:",
            value: "some support",
            color: BOX_COLORS[1],
            x: ((SVG_WIDTH / 3) + 15),
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        },
        {
            key: 2,
            text: "No academic support:",
            value: "no support",
            color: BOX_COLORS[2],
            x: ((SVG_WIDTH / 3) * 2 + 15),
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        }
    ] :
    // Mobile Considerations. If the screensize is less than 700px, return the bollowing boxes
    [
        {
            key: 0,
            text: "A lot of academic support:",
            value: "a lot of support",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.9 - 250 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725,
            height: window.innerHeight * 0.20
        },
        {
            key: 1,
            text: "Some academic support:",
            value: "some support",
            color: BOX_COLORS[1],
            x: 15,
            y: (window.innerHeight * 0.9 - 10 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725, height: window.innerHeight * 0.20
        },
        {
            key: 2,
            text: "No academic support:",
            value: "no support",
            color: BOX_COLORS[2],
            x: 15,
            y: (window.innerHeight * 0.9 - 10 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725, height: window.innerHeight * 0.20
        },
    ]
)

// Box for Question 8
export const WOULD_LIKE_MORE_TECHNICAL_SUPPORT = (window.innerWidth > 700 ?
    // desktop sized boxes.
    [
        {
            key: 0,
            text: "I would like more technical support from:",
            value: "true",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: SVG_WIDTH - 30,
            height: window.innerHeight * 0.17
        }
    ] :
    // Mobile Considerations. If the screensize is less than 700px, return the bollowing boxes
    [
        {
            key: 0,
            text: "I would like more technical support from:",
            value: "true",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.9 - 250 - window.innerHeight * 0.20),
            width: SVG_WIDTH - 30,
            height: window.innerHeight * 0.20
        }
    ]
)

// Boxes for Question 9
export const I_PROVIDE_TECHNICAL_SUPPORT = (window.innerWidth > 700 ?
    // desktop sized boxes.
    [
        {
            key: 0,
            text: "A lot of academic support:",
            value: "a lot of support",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        },
        {
            key: 1,
            text: "Some academic support:",
            value: "some support",
            color: BOX_COLORS[1],
            x: ((SVG_WIDTH / 3) + 15),
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        },
        {
            key: 2,
            text: "No academic support:",
            value: "no support",
            color: BOX_COLORS[2],
            x: ((SVG_WIDTH / 3) * 2 + 15),
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        }
    ] :
    // Mobile Considerations. If the screensize is less than 700px, return the bollowing boxes
    [
        {
            key: 0,
            text: "A lot of academic support:",
            value: "a lot of support",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.9 - 250 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725,
            height: window.innerHeight * 0.20
        },
        {
            key: 1,
            text: "Some academic support:",
            value: "some support",
            color: BOX_COLORS[1],
            x: 15,
            y: (window.innerHeight * 0.9 - 10 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725, height: window.innerHeight * 0.20
        },
        {
            key: 2,
            text: "No academic support:",
            value: "no support",
            color: BOX_COLORS[2],
            x: 15,
            y: (window.innerHeight * 0.9 - 10 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725, height: window.innerHeight * 0.20
        },
    ]
)

// Boxes for Question 10
export const PROVIDES_ME_SUPPORT_ACADEMIC = (window.innerWidth > 700 ?
    // desktop sized boxes.
    [
        {
            key: 0,
            text: "Very comfortable:",
            value: "very comfortable",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        },
        {
            key: 1,
            text: "Somewhat comfortable:",
            value: "somewhat comfortable",
            color: BOX_COLORS[1],
            x: ((SVG_WIDTH / 3) + 15),
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        },
        {
            key: 2,
            text: "Not comfortable:",
            value: "not comfortable",
            color: BOX_COLORS[2],
            x: ((SVG_WIDTH / 3) * 2 + 15),
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        }
    ] :
    // Mobile Considerations. If the screensize is less than 700px, return the bollowing boxes
    [
        {
            key: 0,
            text: "Very comfortable:",
            value: "very comfortable",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.9 - 250 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725,
            height: window.innerHeight * 0.20
        },
        {
            key: 1,
            text: "Somewhat comfortable:",
            value: "somewhat comfortable",
            color: BOX_COLORS[1],
            x: 15,
            y: (window.innerHeight * 0.9 - 10 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725, height: window.innerHeight * 0.20
        },
        {
            key: 2,
            text: "Not comfortable:",
            value: "not comfortable",
            color: BOX_COLORS[2],
            x: 15,
            y: (window.innerHeight * 0.9 - 10 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725, height: window.innerHeight * 0.20
        },
    ]
)

// Boxes for Question 11
export const I_PROVIDE_SUPPORT_ACADEMIC = (window.innerWidth > 700 ?
    // desktop sized boxes.
    [
        {
            key: 0,
            text: "Very comfortable:",
            value: "very comfortable",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        },
        {
            key: 1,
            text: "Somewhat comfortable:",
            value: "somewhat comfortable",
            color: BOX_COLORS[1],
            x: ((SVG_WIDTH / 3) + 15),
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        },
        {
            key: 2,
            text: "Not comfortable:",
            value: "not comfortable",
            color: BOX_COLORS[2],
            x: ((SVG_WIDTH / 3) * 2 + 15),
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        }
    ] :
    // Mobile Considerations. If the screensize is less than 700px, return the bollowing boxes
    [
        {
            key: 0,
            text: "Very comfortable:",
            value: "very comfortable",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.9 - 250 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725,
            height: window.innerHeight * 0.20
        },
        {
            key: 1,
            text: "Somewhat comfortable:",
            value: "somewhat comfortable",
            color: BOX_COLORS[1],
            x: 15,
            y: (window.innerHeight * 0.9 - 10 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725, height: window.innerHeight * 0.20
        },
        {
            key: 2,
            text: "Not comfortable:",
            value: "not comfortable",
            color: BOX_COLORS[2],
            x: 15,
            y: (window.innerHeight * 0.9 - 10 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725, height: window.innerHeight * 0.20
        },
    ]
)

// Boxes for Question 12
export const I_AM_COMFORTABLE_NONACADEMIC = (window.innerWidth > 700 ?
    // desktop sized boxes.
    [
        {
            key: 0,
            text: "Very comfortable:",
            value: "very comfortable",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        },
        {
            key: 1,
            text: "Somewhat comfortable:",
            value: "somewhat comfortable",
            color: BOX_COLORS[1],
            x: ((SVG_WIDTH / 3) + 15),
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        },
        {
            key: 2,
            text: "Not comfortable:",
            value: "not comfortable",
            color: BOX_COLORS[2],
            x: ((SVG_WIDTH / 3) * 2 + 15),
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        }
    ] :
    // Mobile Considerations. If the screensize is less than 700px, return the bollowing boxes
    [
        {
            key: 0,
            text: "Very comfortable:",
            value: "very comfortable",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.9 - 250 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725,
            height: window.innerHeight * 0.20
        },
        {
            key: 1,
            text: "Somewhat comfortable:",
            value: "somewhat comfortable",
            color: BOX_COLORS[1],
            x: 15,
            y: (window.innerHeight * 0.9 - 10 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725, height: window.innerHeight * 0.20
        },
        {
            key: 2,
            text: "Not comfortable:",
            value: "not comfortable",
            color: BOX_COLORS[2],
            x: 15,
            y: (window.innerHeight * 0.9 - 10 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725, height: window.innerHeight * 0.20
        },
    ]
)

// Boxes for Question 13
export const I_PROVIDE_SUPPORT_NONACADEMIC = (window.innerWidth > 700 ?
    // desktop sized boxes.
    [
        {
            key: 0,
            text: "Very comfortable:",
            value: "very comfortable",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        },
        {
            key: 1,
            text: "Somewhat comfortable:",
            value: "somewhat comfortable",
            color: BOX_COLORS[1],
            x: ((SVG_WIDTH / 3) + 15),
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        },
        {
            key: 2,
            text: "Not comfortable:",
            value: "not comfortable",
            color: BOX_COLORS[2],
            x: ((SVG_WIDTH / 3) * 2 + 15),
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        }
    ] :
    // Mobile Considerations. If the screensize is less than 700px, return the bollowing boxes
    [
        {
            key: 0,
            text: "Very comfortable:",
            value: "very comfortable",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.9 - 250 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725,
            height: window.innerHeight * 0.20
        },
        {
            key: 1,
            text: "Somewhat comfortable:",
            value: "somewhat comfortable",
            color: BOX_COLORS[1],
            x: 15,
            y: (window.innerHeight * 0.9 - 10 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725, height: window.innerHeight * 0.20
        },
        {
            key: 2,
            text: "Not comfortable:",
            value: "not comfortable",
            color: BOX_COLORS[2],
            x: 15,
            y: (window.innerHeight * 0.9 - 10 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725, height: window.innerHeight * 0.20
        },
    ]
)

// Boxes for Question 14
export const DIFFICULT_INTERACTION_BOXES = (window.innerWidth > 700 ?
    // desktop sized boxes.
    [
        {
            key: 0,
            text: "Very difficult:",
            value: "very difficult",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        },
        {
            key: 1,
            text: "A little difficult:",
            value: "a little difficult",
            color: BOX_COLORS[1],
            x: ((SVG_WIDTH / 3) + 15),
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        }
    ] :
    // Mobile Considerations. If the screensize is less than 700px, return the bollowing boxes
    [
        {
            key: 0,
            text: "Very difficult:",
            value: "very difficult",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.9 - 250 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725,
            height: window.innerHeight * 0.20
        },
        {
            key: 1,
            text: "A little difficult:",
            value: "a little difficult",
            color: BOX_COLORS[1],
            x: 15,
            y: (window.innerHeight * 0.9 - 10 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725, height: window.innerHeight * 0.20
        }
    ]
)

// Boxes for Question 15
export const SIMILAR_ANSWER_BOXES = (window.innerWidth > 700 ?
    // desktop sized boxes.
    [
        {
            key: 0,
            text: "Very similar:",
            value: "very similar",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        },
        {
            key: 1,
            text: "Somewhat similar:",
            value: "somewhat similar",
            color: BOX_COLORS[1],
            x: ((SVG_WIDTH / 3) + 15),
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        },
        {
            key: 2,
            text: "Not similar at all:",
            value: "not similar",
            color: BOX_COLORS[2],
            x: ((SVG_WIDTH / 3) * 2 + 15),
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        }
    ] :
    // Mobile Considerations. If the screensize is less than 700px, return the bollowing boxes
    [
        {
            key: 0,
            text: "Very similar:",
            value: "very similar",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.9 - 250 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725,
            height: window.innerHeight * 0.20
        },
        {
            key: 1,
            text: "Somewhat similar:",
            value: "somewhat similar",
            color: BOX_COLORS[1],
            x: 15,
            y: (window.innerHeight * 0.9 - 10 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725, height: window.innerHeight * 0.20
        },
        {
            key: 2,
            text: "Not similar at all:",
            value: "not similar",
            color: BOX_COLORS[2],
            x: 15,
            y: (window.innerHeight * 0.9 - 10 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725, height: window.innerHeight * 0.20
        }
    ]
)

/*************************************************************************
 * Separator for showing how the rendering of categories can also be
 * used to create visually seperating elements on screen.
 *************************************************************************/
export const SEPARATOR = [
    {
        key: 0, text: "",
        color: "white",
        x: 1015,
        y: 35,
        width: 0,
        height: 0
    },
    {
        key: 1,
        text: "",
        color: "green",
        x: SVG_WIDTH * 0.5,
        y: 10, width: 2,
        height: SVG_HEIGHT * 0.9
    }
];

