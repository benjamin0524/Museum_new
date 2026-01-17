export interface ExhibitionZone {
    id: number;
    title: string;
    artist: string;
    zoneName: string; // e.g., 'Myopia', 'Hearing'
    description: string; // The main curatorial text
    visualPrompt: string; // For image generation
    imageUrl?: string; // Optional static image override

    // Detailed Content for Interaction
    details: {
        bodyState: string; // 身體狀態
        cause: string; // 成因
        intervention: string; // 醫學介入
        coreMessage: string; // 核心訊息
    };
}

export const exhibitionTheme = {
    name: "身不由己 (Involuntary)",
    description: "當身體不再只由自己決定，我們如何理解「身體差異」與「醫學介入」之可能？"
};

export const exhibitionData: ExhibitionZone[] = [
    // ID 6 (Front Left) - Zone 1: Myopia
    {
        id: 6,
        title: "近視：當世界不是為你的眼睛設計",
        artist: "光學偏差",
        zoneName: "Myopia",
        description: "近視本身若度數較低，短期內主要表現為視力不良；但當近視度數加深、特別是達到高度近視，眼球結構的變化會引發多種眼病性併發症。臨床研究顯示，隨著眼軸越長，近視性黃斑部病變、視網膜剝離、白內障與青光眼等併發率顯著增加，尤以黃斑部病變與視網膜剝離最為常見，同時也可能提前發生且更易造成不可逆的視力損害。病理性變化的機制包括視網膜牽拉、脈絡膜萎縮及玻璃體退化等，這些變化若未及早監測與處理，可能導致中心視力喪失甚至失明。\n\n參考資料：洪資惠（2023）。高度近視併發症與眼軸長之關聯性：一項回顧性橫斷式研究〔碩士論文，中山醫學大學〕。華藝線上圖書館。https://doi.org/10.6834/csmu202300103",
        visualPrompt: "blurred vision glasses lens refraction optical art",
        imageUrl: "/assets/myopia_zone.png",
        details: {
            bodyState: "視力不良與眼球結構變化",
            cause: "(1)先天遺傳基因\n(2)高度近距離用眼的生活型態、講求高科技的現代社會",
            intervention: "(1)眼鏡與隱形眼鏡\n(2)雷射視力矯正手術",
            coreMessage: "在高度需要「看見」的現代世界，每天看手機、平板、電腦，你的眼睛還是你的眼睛嗎？"
        }
    },
    // ID 4 (Mid Left) - Zone 2: Hearing Impairment
    {
        id: 4,
        title: "展區二｜聽障：當世界的聲音不為你而調整",
        artist: "沈默",
        zoneName: "Hearing",
        description: "聽力障礙（聽障）是指聽覺能力減弱或喪失，造成聲音感知、辨識與語言理解的困難，常見症狀包括聽不清他人說話、在背景噪音下辨識對話困難、需提高音量才能聽見、常要求對方重複話語、以及感覺聲音模糊或遲鈍等。例如在日常交流時可能無法理解電話、電視對話；在社交場合，因聽不清而避免參與對話或聚會。這些聽覺症狀進一步影響生活功能，增加溝通負擔與心理壓力，導致疲勞、誤解、焦慮及社交迴避等現象。聽障者在人際互動與情緒反應上也可能遇到挑戰，特別是在未配戴輔具或未獲得適當支持時。臨床研究指出，聽障對生活品質有顯著負面影響，包括就業、教育程度、情緒穩定性及社交參與等方面的不便，例如聽障受訪者在助聽器使用、社交理解與人際關懷上表現為顯著問題；且教育及就業成果低於一般族群，突顯聽障者在日常生活中面對的多重挑戰。\n\n參考資料\n林秀卿、于普華（2007）。聽力障礙者生活品質及其相關因素之探討。澄清醫護管理雜誌，3(1)，18-26。https://doi.org/10.30156/CCMJ.200701.0004",
        visualPrompt: "sound waves visual representation silence abstract ear cochlear implant artistic",
        imageUrl: "/assets/hearing_zone.png",
        details: {
            bodyState: "聽力障礙（聽障）是指聽覺能力減弱或喪失，造成聲音感知、辨識與語言理解的困難。\n常見症狀：聽不清他人說話、背景噪音下對話困難、需提高音量、感覺聲音模糊。",
            cause: "(1)先天遺傳基因\n(2)老化造成的退化\n(3)後天疾病或損傷",
            intervention: "(1)助聽器\n(2)人工電子耳手術",
            coreMessage: "聽不見不是不專心，而是聲音從來沒有放慢速度。"
        }
    },
    // ID 2 (Back Left) - Zone 3: Disability
    {
        id: 2,
        title: "展區三｜身障：當身體遭遇無法預期的改變",
        artist: "命運",
        zoneName: "Disability",
        description: "肢體身障一般指因先天或後天原因造成肌肉、骨骼或神經功能受損，導致活動能力受限的身體障礙。典型症狀包括行走困難、平衡不良、上下樓梯受阻、需要輪椅或助行器輔助，甚至在握持、操作物件時出現困難。這些功能性限制使肢體身障者在日常生活活動（如穿衣、洗澡、進食等）上需要額外的時間與協助，或依賴輔具與他人支持。由於行動受限，肢體身障者的生活不便廣泛存在於居家環境、公共空間與交通使用中，例如坡道、樓梯、狹窄通道或無障礙設施不足時，常造成無法獨立出行與參與社會活動的障礙。此外，因為行動及環境不便，肢體身障者在就業、教育與社交參與方面也面臨更高的阻礙，可能因環境設計或社會態度不友善而降低生活品質。\n\n參考資料\n蔡佳穎（2010）。肢體障礙者社會支持與生活品質相關因素之探討。澄清醫護管理雜誌，3(1)，18-26。https://doi.org/10.30156/CCMJ.200701.0004",
        visualPrompt: "prosthetics wheelchair mobility aid stairs accessibility barrier abstract art",
        imageUrl: "/assets/disability_zone.jpg",
        details: {
            bodyState: "肢體身障一般指因先天或後天原因造成肌肉、骨骼或神經功能受損，導致活動能力受限的身體障礙。\n典型症狀：行走困難、平衡不良、上下樓梯受阻、需輔具協助。",
            cause: "(1)先天疾病或發育異常\n(2)後天重大疾病\n(3)意外事故導致的身體損傷",
            intervention: "(1)義肢\n(2)行動輔具\n(3)復健醫學",
            coreMessage: "身體的改變從來不是一種選擇，但如何生活，是。"
        }
    },
    // ID 3 (Right Back) - Zone 4: Obesity
    {
        id: 3,
        title: "展區四｜肥胖：當身體的能量系統失去平衡",
        artist: "代謝系統",
        zoneName: "Obesity",
        description: "肥胖是一種慢性代謝性疾病，主要表現為體脂肪過度堆積，常以身體質量指數（BMI）作為判斷依據。其臨床症狀除體重明顯增加外，亦常伴隨活動耐力下降、容易疲倦、行動遲緩、關節負擔加重、呼吸急促及睡眠品質不佳等問題。部分肥胖者在日常生活中會出現爬樓梯困難、久站不適、膝關節與下背疼痛，並可能合併打鼾或睡眠呼吸中止症，影響白天精神與專注力。\n在醫學上，肥胖並非單純外觀或體態問題，而與多種慢性疾病密切相關。研究指出，肥胖會顯著增加第二型糖尿病、高血壓、高血脂與心血管疾病的風險，亦與脂肪肝、痛風、多囊性卵巢症候群及部分癌症（如大腸癌、乳癌）具有相關性。此外，長期肥胖亦可能造成胰島素阻抗與慢性發炎反應，使代謝功能逐漸惡化，形成所謂「代謝症候群」。心理層面上，肥胖者亦較容易出現自我形象低落、焦慮與憂鬱情緒，進一步影響生活品質與社會參與。整體而言，肥胖是一種涉及生理、心理與社會層面的多因素疾病，需要透過醫療介入、生活型態調整與長期健康管理共同處理。\n\n參考資料\n彭仁奎、黃國晉、陳慶餘（2006）。肥胖與代謝症候群。基層醫學，21(12)，367-371。https://doi.org/10.6965/PMCFM.200612.0367",
        visualPrompt: "metabolism energy balance scale dna helix food environment abstract",
        imageUrl: "/assets/obesity_zone.png",
        details: {
            bodyState: "肥胖是一種慢性代謝性疾病，主要表現為體脂肪過度堆積。\n臨床症狀：活動耐力下降、易疲倦、關節負擔加重、呼吸急促、睡眠品質不佳。",
            cause: "(1)先天基因體質\n(2)內分泌與荷爾蒙失調\n(3)高熱量飲食環境高度可近",
            intervention: "(1)減重手術\n(2)減重藥物治療",
            coreMessage: "體重不是道德問題，而是一套身體系統的運作結果。"
        }
    },
    // ID 1 (End Wall) - Zone 5: Final Wall / Reflection
    {
        id: 1,
        title: "展區五｜選擇與支持：身不由己之後",
        artist: "社會集體意識",
        zoneName: "FinalWall",
        description: "努力與醫學，從來不是對立的選項。有人選擇靠意志力調整生活習慣、有人選擇透過醫學協助加快進程與減輕負荷，兩者都是選擇，都值得尊重。每個人有不同的身體條件，所生活的環境也各自不同，有些人的困難並非我們所能想像。醫學不是捷徑，而是為那些「身」不由己的人們，準備的一條安全道路。",
        visualPrompt: "interactive reflection wall mirror questions glowing text",
        details: {
            bodyState: "Q1. 如果醫學可以幫助你更快回到想要的生活狀態，你會選擇嗎？\nQ2. 如果別人選擇醫學協助，你會支持嗎？",
            cause: "策展核心精神總結：\n1.健康狀態是基因、生理與環境交互作用的結果\n2.醫學介入是一種理性、有效且正當的選擇\n3.身體差異應被理解，而非被道德化審判",
            intervention: "N/A",
            coreMessage: "接納差異，尊重選擇。這不僅是醫學的進步，更是人性的光輝。"
        }
    }
];
