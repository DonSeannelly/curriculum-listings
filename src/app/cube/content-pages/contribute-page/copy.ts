export const sections = {
    contribute: {
        title: 'Contribute',
        topics: [
            {
                title: 'Starting Out',
                questions: [
                    {
                        question: 'Your Profile',
                        answer: 'Your profile is a simple webpage that shows your basic public user information on CLARK. The ' +
                         'information includes your chosen name, associated institution, email, biography, and all of your created ' +
                         'learning objects. You will also see your unsubmitted learning objects from your profile, but only your ' +
                         'released learning objects are viewable by the public. You can edit your profile information at any time ' +
                         'with the <em>Edit Profile</em> button.'
                    },
                    {
                        question: 'Your Dashboard',
                        answer: 'Your dashboard is where you will access and create all of your learning objects. The dashboard is the ' +
                        'primary way to begin designing a learning object. All draft (non-released) and released learning objects can be' +
                        ' viewed within the dashboard. In addition, a status designates all learning objects while on the dashboard.'
                    },
                    {
                        question: 'The Learning Object Builder',
                        answer: 'When clicking the <em>"NEW +"</em> button, it will direct you to the learning object builder to start ' +
                        'designing a learning object. The learning object builder is where you will enter your curriculum for ' +
                        'submitting on CLARK. All required information is listed throughout the builder through its three sections: ' +
                        '<em>Basic Information</em>, <em>Learning Outcomes</em>, and <em>Materials</em>. For more details, please see ' +
                        'the <em>"Creating Learning Objects"</em> tab.'
                    }
                ]
            }
        ]
    },
    creating: {
        title: 'Creating Learning Objects',
        topics: [
            {
                title: 'Building a Learning Object',
                questions: [
                    {
                        question: 'Basic Information',
                        answer: 'The basic information tab covers the required descriptive tags of a learning object. These tags include' +
                        ' the learning object name, known authors/contributors, learning object length, designated academic levels,' +
                        ' and learning object description.'
                    },
                    {
                        question: 'Learning Outcomes',
                        answer:
                        `
                        <p>
                        The learning outcomes tab covers the set of outcomes a user will accomplish after completing the 
                        learning object. An outcome is a statement made by the author through the built-in Blooming Onion Builder, 
                        which uses a provided list of action verbs tied to an academic goal. An example of this is, "Explain why ethics 
                        is important in cybersecurity." 
                        </p>
                        <p>
                        The <em>Blooming Onion Builder</em> also allows authors to map out their outcomes to 
                        standardized curricular guidelines. A curricular guideline is a specific instructional statement created by a 
                        recognized academic-adjacent group that focuses on a particular academic purpose. An example is applying the 
                        <em>CAE Cyber Defense - Cybersecurity Ethics (KU3) - 2019</em> curricular guideline to our ethics outcome. This 
                        curricular guideline is listed as, "Describe the role of cybersecurity in supporting and encouraging ethics, 
                        as well as where cybersecurity practices can cause ethical conflicts." 
                        </p>
                        <p>
                        An author can create as many learning outcomes as they want for a learning object. Authors can optionally map curricular guidelines to each of these outcomes.
                        </p>
                        `
                    },
                    {
                        question: 'Materials',
                        answer:
                        `
                        <p>
                        The materials tab covers the main curriculum content featured in a learning object. Content can 
                        include uploaded files and folders, URL links, and additional notes. Not all learning objects need to contain 
                        files, as some learning objects may link to an external site for curriculum instead. For example, an author 
                        may use a URL link for further resource citations or larger files that are not uploadable. 
                        </p>
                        <p>
                        If an author wants to include additional instructions, this can be done through the notes section. Notes are 
                        not required but can be handy if an author wants a user to have further clarification about an object.
                        </p>
                        `
                    },
                    {
                        question: 'Formatting Object Materials',
                        answer:
                        `
                        <p>
                        Learning object materials can be formatted in different ways as long as it conveys the lesson plan and its 
                        material in an accessible format. If you are unsure how to start formatting your learning object material, 
                        NSA Funded Curriculum on CLARK offers a convenient template for formatting materials.
                        </p>
                        <p>
                        Go to <a href="https://clark.center/c/nccp">https://clark.center/c/nccp</a> and click the downloadable link under 
                        <em>NCCP Learning Object Templates</em>. A zip folder will be downloaded to your machine with instructions and 
                        examples of formatted materials. The <em>NCCP Learning Object Templates</em> download features the following:
                        </p>
                        <ul>
                            <li>A syllabus template with formatting guidelines.</li>
                            <li>An example syllabus.</li>
                            <li>A module template.</li>
                            <li>A PowerPoint slides template.</li>
                            <li>A lab template.</li>
                            <li>A lab solutions template.</li>
                            <li>An assessment guide template.</li>
                            <li>A folder of a completed learning object with all formatted materials.</li>
                        </ul>
                        <p>
                        Please note that not every template mentioned above is needed for a complete learning object. If you provide any 
                        type of these materials, we recommend following the NCCP format for further guidance.
                        </p>
                        <p>
                        For these two types of files, “A lab solutions template” and “An assessment guide template”, please know that 
                        anybody can make an account on CLARK to access these materials, including students. In addition, any assessment 
                        solutions will be flagged and verified by the author if they still want to include them.
                        </p>
                        `
                    },
                    {
                        question: 'Children',
                        answer: 'If a learning object is part of a set of multiple learning objects, an author could place it into a ' +
                        'hierarchy. The children column on the left side of the builder will be available if the learning object length ' +
                        'is set as a micromodule or bigger. If the author toggles the children column on, the author will be able to ' +
                        'connect or disconnect any smaller learning object to the one in the builder as a child in the hierarchy.'
                    }
                ]
            },
            {
                title: 'Submitting a Learning Object',
                questions: [
                    {
                        question: 'Requirements for Released Learning Objects',
                        answer:
                        `
                        <p>
                        After an author is done creating a learning object, the author can submit it for review with the 
                        button on the top right of the builder. The author will see a checkbox to verify all relevant requirements 
                        have been made to the best of their ability.
                        </p>
                        <ul>
                            <li>Been checked for spelling and grammar errors.</li>
                            <li>All materials that are needed for this Learning Object are uploaded.</li>
                            <li>All materials (i.e. PowerPoints, PDFs, videos etc.) are accessible under Section 508 of the Americans 
                            with Disability Act.</li>
                            <li>All child objects of this Learning Object are in the hierarchy.</li>
                            <li>All materials are correctly linked (i.e. YouTube videos or VM downloads).</li>
                            <li>All of the learning outcomes you would like to include are added.</li>
                        </ul>
                        `
                    },
                    {
                        question: 'Which Collection to Submit To?',
                        answer: 'After verifying the requirements checkbox, the author will be prompted to select a collection to submit' +
                        ' the learning object. If an author is unsure or the learning object is not associated with any collection, it' +
                        ' should be submitted to the <em>Cyber Heroes</em> collection.'
                    }
                ]
            },
        ]
    }
};
