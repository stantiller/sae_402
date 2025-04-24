// histoire
const storyScreen = document.querySelector(".storyScreen");
const storyDiv = document.querySelector(".dialogueBox");
const animDiv = document.querySelector(".animTxt");
const speakerDiv = document.querySelector(".speaker");
const imgSpeaker = document.querySelector(".imgSpeaker");

document.querySelector(".toStory").addEventListener("click", startStory);

let clickCount = 0;

function startStory()
{
    // document.querySelector(".").classList.add("invisible");
    storyScreen.classList.remove("invisible");

    storyDiv.addEventListener("click", () => {
        if (clickCount < story.length)
        {
            const dialogue = story[clickCount % story.length];
            speakerDiv.innerHTML = dialogue.character;

            if (dialogue.character == "You")
              imgSpeaker.innerHTML = "<img src='img/siteImg/player.png'>";
            else if (dialogue.character == "Thief")
              imgSpeaker.innerHTML = "<img src='img/siteImg/thief.png'>";
            else if (dialogue.character == "Museum staff")
              imgSpeaker.innerHTML = "<img src='img/siteImg/staff.png'>";
            else 
              imgSpeaker.innerHTML = "";

            animText(dialogue.text);
            clickCount++;
        }
        else
        {
            document.body.style.background = "red";
        }
    });
}

const story = [
    {
        character: "",
        text: "It was a nice friday afternoon and you were walking near the musée des beaux arts."
    },
    {
        character: "",
        text: "But suddenly you see a group of suspicious looking people rush out of the museum with a bunch of paintings."
    },
    {
        character: "",
        text: "You decide that you should probably chase them before they escape and leave with the paintings."
    },
    {
        character: "You",
        text: "I need to go over the bench if I want to catch up to them !"
    }
];

function animText(text) {
    let output = "";
    for (const letter of text) {
        output += `<span>${letter}</span>`;
    }
    animDiv.innerHTML = output;
    [...animDiv.children].forEach((span, index) => {
        setTimeout(() => {
            span.classList.add("visible");
        }, 50 * index);
    });
}