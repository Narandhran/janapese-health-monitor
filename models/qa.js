const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const qaSchema = new mongoose.Schema({
    question: {
        type: String,
        lowercase: true,
        unique: true
    },
    jQuestion: {
        type: String
    },
    type: {
        type: String,
        enum: ['radio', 'checkbox', 'text', 'dropdown'],
        lowercase: true
    },
    options: {
        type: [String],
        default: []
    },
    jOptions: {
        type: [String],
        default: []
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    }
}, { collection: 'qas', timestamps: true });

let x = /** 
* Paste one or more documents here
*/
    [
        {
            "options": [],
            "jOptions": [
                "結果が不検出（陰性",
                "擬陽性",
                "陽性"
            ],
            "status": true,
            "question": "Test result",
            "type": "dropdown"
        },
        {
            "options": [],
            "jOptions": [
                "でない",
                "たまにでる",
                "頻繁にでる"
            ],
            "status": true,
            "question": "Do you have cough ?",
            "type": "dropdown"
        },
        {
            "options": [],
            "jOptions": [
                "痛くない",
                "少し痛い",
                "痛い"
            ],
            "status": true,
            "question": "Do you have throat pain ?",
            "type": "dropdown"
        },
        {
            "options": [],
            "jOptions": [
                "ない",
                "少しある",
                "ある",
                "ひどくある"
            ],
            "status": true,
            "question": "Do you have dullness ?",
            "type": "dropdown"
        },
        {
            "options": [],
            "jOptions": [
                "異常はない",
                "味または匂いがわかりずらい",
                "味または匂いがわからないた"
            ],
            "status": true,
            "question": "Smell ?",
            "type": "dropdown"
        },
        {
            "options": [],
            "jOptions": [
                "痛くない",
                "少し痛い",
                "痛い"
            ],
            "status": true,
            "question": "Headache ?",
            "type": "dropdown"
        },
        {
            "options": [],
            "jOptions": [
                "はい",
                "いいえ"
            ],
            "status": true,
            "question": "Visited outside prefecture ?",
            "type": "dropdown"
        },
        {
            "options": [],
            "jOptions": [
                "あり",
                "なし"
            ],
            "status": true,
            "question": "Visit club or dance events ?",
            "type": "dropdown"
        },
        {
            "options": [],
            "jOptions": [
                "はい",
                "いいえ"
            ],
            "status": true,
            "question": "Without mask do you meet ?",
            "type": "dropdown"
        },
        {
            "options": [],
            "jOptions": [
                "はい",
                "いいえ"
            ],
            "status": true,
            "question": "Do you visit infected area ?",
            "type": "dropdown"
        },
        {
            "options": [],
            "jOptions": [
                "はい",
                "いいえ"
            ],
            "status": true,
            "question": "Do you wash you hand ?",
            "type": "dropdown"
        },
        {
            "options": [],
            "jOptions": [
                "はい",
                "いいえ"
            ],
            "status": true,
            "question": "Infected people around you ?",
            "type": "dropdown"
        },
        {
            "options": [],
            "jOptions": [
                "はい",
                "いいえ"
            ],
            "status": true,
            "question": "Is there infected people in your family or so ?",
            "type": "dropdown"
        }
    ]

qaSchema.plugin(uniqueValidator);
module.exports = mongoose.model('QaSchema', qaSchema);