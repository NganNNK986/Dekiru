export interface GrammarQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export const grammarQuizData: GrammarQuestion[] = [
  // 1
  {
    id: "gq-1",
    question: "今年の夏は去年______涼しい。",
    options: ["に比べ", "にしては", "において", "にそって"],
    correctAnswerIndex: 0,
    explanation: "「に比べ」(So với...) dùng để so sánh 2 đối tượng thực tế (mùa hè năm nay và năm ngoái)."
  },
  // 2
  {
    id: "gq-2",
    question: "外国人______日本語が上手だ。",
    options: ["に比べ", "にしては", "において", "にそって"],
    correctAnswerIndex: 1,
    explanation: "「にしては」(So với... thì...) diễn tả kết quả trái với mong đợi (người nước ngoài nhưng tiếng Nhật rất giỏi)."
  },
  // 3
  {
    id: "gq-3",
    question: "彼はよく食べる______太らない。",
    options: ["わりに", "にしては", "だけあって", "おかげで"],
    correctAnswerIndex: 0,
    explanation: "「わりに」(So với/Vậy mà) mang sắc thái trung tính hơn, diễn tả sự bất tương xứng giữa 2 vế."
  },
  // 4
  {
    id: "gq-4",
    question: "彼女はモデル______きれいに歩く。",
    options: ["のように", "のような", "に比べて", "にかけて"],
    correctAnswerIndex: 0,
    explanation: "「ように」bổ nghĩa cho động từ (きれいに歩く). Mang nghĩa \"giống như\"."
  },
  // 5
  {
    id: "gq-5",
    question: "あのような______人が好きです。",
    options: ["のように", "のような", "みたいに", "くらい"],
    correctAnswerIndex: 1,
    explanation: "「のような」bổ nghĩa cho danh từ (人). Nghĩa là \"người giống như vậy\"."
  },
  // 6
  {
    id: "gq-6",
    question: "あの人は子ども______泣いている。",
    options: ["みたいに", "みたいな", "ように", "そうな"],
    correctAnswerIndex: 0,
    explanation: "「みたいに」là văn nói của 「のように」, bổ nghĩa cho động từ 泣いている."
  },
  // 7
  {
    id: "gq-7",
    question: "星______形をしたクッキーを作った。",
    options: ["みたいに", "みたいな", "ように", "そうな"],
    correctAnswerIndex: 1,
    explanation: "「みたいな」là văn nói của 「のような」, bổ nghĩa cho danh từ (形)."
  },
  // 8
  {
    id: "gq-8",
    question: "この映画は実話______作られた。",
    options: ["をもとに", "に基づいて", "を中心に", "に代わって"],
    correctAnswerIndex: 0,
    explanation: "「をもとに」nghĩa là \"dựa trên\" (lấy làm tư liệu, cơ sở để sáng tạo ra cái mới)."
  },
  // 9
  {
    id: "gq-9",
    question: "調査の結果______、新しい計画を立てる。",
    options: ["をもとに", "に基づいて", "を通して", "として"],
    correctAnswerIndex: 1,
    explanation: "「に基づいて」nghĩa là \"căn cứ vào\" (những dữ liệu, số liệu rõ ràng mang tính chính thức)."
  },
  // 10
  {
    id: "gq-10",
    question: "先生が教えてくれた______、試験に合格できました。",
    options: ["おかげで", "せいで", "せいか", "ものだから"],
    correctAnswerIndex: 0,
    explanation: "「おかげで」chỉ nguyên nhân dẫn đến kết quả tích cực (Nhờ có...)."
  },
  // 11
  {
    id: "gq-11",
    question: "雨が降った______、試合が中止になった。",
    options: ["おかげで", "せいで", "せいか", "ものだから"],
    correctAnswerIndex: 1,
    explanation: "「せいで」chỉ nguyên nhân dẫn đến kết quả tiêu cực (Tại vì...)."
  },
  // 12
  {
    id: "gq-12",
    question: "疲れている______、頭が痛い。",
    options: ["おかげで", "せいで", "せいか", "せいだ"],
    correctAnswerIndex: 2,
    explanation: "「せいか」nghĩa là \"Có lẽ là do...\" (phỏng đoán nguyên nhân chưa chắc chắn)."
  },
  // 13
  {
    id: "gq-13",
    question: "私が失敗したのは、彼の______。",
    options: ["おかげだ", "せいだ", "せいか", "せいで"],
    correctAnswerIndex: 1,
    explanation: "Cuối câu dùng để khẳng định nguyên nhân tiêu cực phải dùng 「せいだ」."
  },
  // 14
  {
    id: "gq-14",
    question: "遅れてすみません。バスが来なかった______。",
    options: ["からして", "ものだから", "おかげで", "ことから"],
    correctAnswerIndex: 1,
    explanation: "「ものだから」dùng để giải thích lý do một cách lịch sự, thường dùng khi xin lỗi."
  },
  // 15
  {
    id: "gq-15",
    question: "まだ子供な______、少しうるさいかもしれません。",
    options: ["ものですから", "せいで", "おかげで", "からして"],
    correctAnswerIndex: 0,
    explanation: "「ものですから」là cách nói lịch sự hơn của 「ものだから」."
  },
  // 16
  {
    id: "gq-16",
    question: "あまりにも急な______、準備ができませんでした。",
    options: ["もので", "せいで", "おかげで", "ことから"],
    correctAnswerIndex: 0,
    explanation: "「もので」cũng mang ý nghĩa giải thích lý do (vì/do) trong văn nói."
  },
  // 17
  {
    id: "gq-17",
    question: "顔が似ている______、二人は兄弟だとわかった。",
    options: ["ことから", "からして", "おかげで", "せいで"],
    correctAnswerIndex: 0,
    explanation: "「ことから」nghĩa là \"Vì (sự thật)... nên...\", dùng làm căn cứ để suy luận."
  },
  // 18
  {
    id: "gq-18",
    question: "タイトル______面白そうだ。",
    options: ["ことから", "からして", "にかけて", "として"],
    correctAnswerIndex: 1,
    explanation: "「からして」nghĩa là \"Ngay từ... (đã)\", lấy một ví dụ nhỏ làm căn cứ để đánh giá toàn thể."
  },
  // 19
  {
    id: "gq-19",
    question: "私が知っている______、彼はそんなことをする人ではない。",
    options: ["限り", "限りは", "ない限り", "だけに"],
    correctAnswerIndex: 0,
    explanation: "「限り」nghĩa là \"Trong giới hạn/Miễn là\". (Trong giới hạn những gì tôi biết...)"
  },
  // 20
  {
    id: "gq-20",
    question: "日本にいる______、日本語を勉強し続けたい。",
    options: ["限り", "限りは", "ない限り", "うちに"],
    correctAnswerIndex: 1,
    explanation: "「限りは」nghĩa là \"Chừng nào còn...\". Chừng nào còn ở Nhật thì..."
  },
  // 21
  {
    id: "gq-21",
    question: "明日、雨が降ら______限り、ピクニックに行きます。",
    options: ["ない", "なかった", "なく", "なくて"],
    correctAnswerIndex: 0,
    explanation: "「Vない + 限り」có nghĩa là \"Nếu không...\". Nếu không mưa thì sẽ đi picnic."
  },
  // 22
  {
    id: "gq-22",
    question: "地震______、水と食料を買っておく。",
    options: ["に備えて", "をもとに", "を中心に", "を通して"],
    correctAnswerIndex: 0,
    explanation: "「に備えて」nghĩa là \"Chuẩn bị cho... / Đề phòng...\". Chuẩn bị cho động đất."
  },
  // 23
  {
    id: "gq-23",
    question: "映画を見る______、家で本を読む。",
    options: ["の代わりに", "に代わって", "に代わり", "をはじめ"],
    correctAnswerIndex: 0,
    explanation: "「の代わりに」nghĩa là \"Thay thế/Đổi lại\". Thay vì xem phim thì đọc sách."
  },
  // 24
  {
    id: "gq-24",
    question: "社長______、私がご挨拶申し上げます。",
    options: ["の代わりに", "に代わって", "として", "をはじめ"],
    correctAnswerIndex: 1,
    explanation: "「に代わって」nghĩa là \"Thay mặt\" (chỉ dùng thay mặt người khác)."
  },
  // 25
  {
    id: "gq-25",
    question: "父______、私が会議に出席します。",
    options: ["の代わりに", "に代わって", "に代わり", "として"],
    correctAnswerIndex: 2,
    explanation: "「に代わり」là hình thức văn viết trang trọng của 「に代わって」(Thay mặt)."
  },
  // 26
  {
    id: "gq-26",
    question: "この地域は、農業______発展してきた。",
    options: ["を中心に", "を通して", "をはじめ", "をもとに"],
    correctAnswerIndex: 0,
    explanation: "「を中心に」nghĩa là \"Lấy ~ làm trung tâm\". Lấy nông nghiệp làm trung tâm."
  },
  // 27
  {
    id: "gq-27",
    question: "地球は太陽______回っている。",
    options: ["を中心に", "を中心として", "を通して", "をもとに"],
    correctAnswerIndex: 1,
    explanation: "「を中心として」có cùng ý nghĩa với 「を中心に」nhưng trang trọng hơn."
  },
  // 28
  {
    id: "gq-28",
    question: "校長先生______、先生方、ありがとうございました。",
    options: ["をはじめ", "はもちろん", "を通して", "に代わって"],
    correctAnswerIndex: 0,
    explanation: "「をはじめ」nghĩa là \"Tiêu biểu là...\" (Dùng để đưa ra một đại diện điển hình)."
  },
  // 29
  {
    id: "gq-29",
    question: "アジア______、世界中で人気がある。",
    options: ["をはじめとして", "はもちろん", "を通して", "に代わって"],
    correctAnswerIndex: 0,
    explanation: "「をはじめとして」là hình thức trang trọng của 「をはじめ」(Tiêu biểu là...)."
  },
  // 30
  {
    id: "gq-30",
    question: "このパソコンは、デザイン______、性能も優れている。",
    options: ["をはじめ", "はもちろん", "を通して", "に代わり"],
    correctAnswerIndex: 1,
    explanation: "「はもちろん」nghĩa là \"Không chỉ... mà còn...\". Thiết kế thì đã đành, tính năng cũng xuất sắc."
  },
  // 31
  {
    id: "gq-31",
    question: "国内______、海外でも販売されている。",
    options: ["はもとより", "はもちろん", "をはじめ", "を通して"],
    correctAnswerIndex: 0,
    explanation: "「はもとより」là cách nói trang trọng hơn của 「はもちろん」(Không chỉ... mà còn...)."
  },
  // 32
  {
    id: "gq-32",
    question: "友達______、彼女と知り合った。",
    options: ["を通して", "を通じて", "を中心に", "をもとに"],
    correctAnswerIndex: 0,
    explanation: "「を通して」nghĩa là \"Thông qua (sự môi giới/phương tiện)\". Quen cô ấy thông qua bạn bè."
  },
  // 33
  {
    id: "gq-33",
    question: "一年______、花が咲いている。",
    options: ["を通じて", "を通して", "を中心に", "をもとに"],
    correctAnswerIndex: 0,
    explanation: "「を通じて」cũng có nghĩa \"Thông qua\" hoặc \"Suốt (khoảng thời gian)\"."
  },
  // 34
  {
    id: "gq-34",
    question: "彼は留学生______日本に来た。",
    options: ["として", "に代わって", "を通して", "を中心に"],
    correctAnswerIndex: 0,
    explanation: "「として」nghĩa là \"Với tư cách là / Vai trò là...\"."
  },
  // 35
  {
    id: "gq-35",
    question: "この写真を見る______、亡くなった母を思い出す。",
    options: ["うちに", "につけ", "たびに", "ながら"],
    correctAnswerIndex: 2,
    explanation: "「たびに」nghĩa là \"Mỗi lần đều\". Cứ mỗi lần nhìn ảnh là lại nhớ."
  },
  // 36
  {
    id: "gq-36",
    question: "忘れない______、メモしておこう。",
    options: ["うちに", "たびに", "につけ", "ながら"],
    correctAnswerIndex: 0,
    explanation: "「うちに」nghĩa là \"Trong lúc/Tranh thủ lúc\". Tranh thủ lúc chưa quên thì ghi chú lại."
  },
  // 37
  {
    id: "gq-37",
    question: "良い______悪い______、親は子供のことを心配するものだ。",
    options: ["につけ", "たびに", "うちに", "ながら"],
    correctAnswerIndex: 0,
    explanation: "「～につけ ～につけ」nghĩa là \"Dù là... hay... thì đều...\". Thường đi với các cặp đối lập."
  },
  // 38
  {
    id: "gq-38",
    question: "年をとる______、体力が落ちてくる。",
    options: ["とともに", "ながら", "うちに", "たびに"],
    correctAnswerIndex: 0,
    explanation: "「とともに」nghĩa là \"Cùng với / Đồng thời với sự thay đổi...\". Tuổi càng cao thì thể lực càng giảm."
  },
  // 39
  {
    id: "gq-39",
    question: "音楽を聞き______、勉強する。",
    options: ["ながら", "つつ", "うちに", "とともに"],
    correctAnswerIndex: 0,
    explanation: "「ながら」nghĩa là \"Vừa... vừa...\". Vừa nghe nhạc vừa học."
  },
  // 40
  {
    id: "gq-40",
    question: "狭い______、楽しい我が家だ。",
    options: ["ながらも", "ながら", "つつ", "とともに"],
    correctAnswerIndex: 0,
    explanation: "「ながらも」nghĩa là \"Tuy... nhưng...\". Tuy hẹp nhưng là ngôi nhà vui vẻ."
  },
  // 41
  {
    id: "gq-41",
    question: "死ぬ______疲れた。",
    options: ["ほど", "くらい", "ぐらい", "だけあって"],
    correctAnswerIndex: 0,
    explanation: "「ほど」nghĩa là \"Đến mức\". Mệt đến mức muốn chết."
  },
  // 42
  {
    id: "gq-42",
    question: "泣きたい______痛い。",
    options: ["くらい", "ほど", "ばかり", "だけ"],
    correctAnswerIndex: 0,
    explanation: "「くらい」cũng mang nghĩa \"Đến mức / Khoảng\". Đau đến mức muốn khóc."
  },
  // 43
  {
    id: "gq-43",
    question: "ちょっと休む______の時間もない。",
    options: ["ぐらい", "ほど", "ばかり", "だけ"],
    correctAnswerIndex: 0,
    explanation: "「ぐらい」là khẩu ngữ của くらい. Nghĩa là \"Chí ít cũng / Cỡ như\"."
  },
  // 44
  {
    id: "gq-44",
    question: "ひらがな______書けない。",
    options: ["さえ", "まで", "くらい", "ほど"],
    correctAnswerIndex: 0,
    explanation: "「さえ」nghĩa là \"Ngay cả / Thậm chí\". Ngay cả hiragana cũng không viết được."
  },
  // 45
  {
    id: "gq-45",
    question: "借金して______、車を買いたい。",
    options: ["まで", "さえ", "からして", "にかけて"],
    correctAnswerIndex: 0,
    explanation: "「まで」nghĩa là \"Đến mức / Thậm chí làm cả việc đó\". Muốn mua xe đến mức sẵn sàng vay nợ."
  },
  // 46
  {
    id: "gq-46",
    question: "お金があれば幸せだという______。",
    options: ["わけではない", "ことではない", "はずがない", "わけだ"],
    correctAnswerIndex: 0,
    explanation: "「わけではない」nghĩa là \"Không hẳn là / Không có nghĩa là...\"."
  },
  // 47
  {
    id: "gq-47",
    question: "全然勉強していない______けど、自信がない。",
    options: ["わけじゃない", "わけではない", "わけだ", "ことだ"],
    correctAnswerIndex: 0,
    explanation: "「わけじゃない」là dạng khẩu ngữ của 「わけではない」."
  },
  // 48
  {
    id: "gq-48",
    question: "毎日残業していれば、疲れる______。",
    options: ["わけだ", "わけではない", "ことだ", "ものだ"],
    correctAnswerIndex: 0,
    explanation: "「わけだ」nghĩa là \"Thảo nào / Đương nhiên là\". Ngày nào cũng làm thêm, thảo nào mà mệt."
  },
  // 49
  {
    id: "gq-49",
    question: "つまり、明日から休み______。",
    options: ["というわけだ", "というものだ", "ということだ", "というはずだ"],
    correctAnswerIndex: 0,
    explanation: "「というわけだ」dùng để kết luận, diễn giải lại ý nghĩa sự việc: \"Nghĩa là...\"."
  },
  // 50
  {
    id: "gq-50",
    question: "この問題は少し難しい______。",
    options: ["ように思う", "でしょう", "にきまっている", "ようだ"],
    correctAnswerIndex: 0,
    explanation: "「ように思う」dùng để bày tỏ ý kiến cá nhân một cách nhẹ nhàng: \"Tôi nghĩ rằng có vẻ...\"."
  },
  // 51
  {
    id: "gq-51",
    question: "明日は雨が降る______。",
    options: ["でしょう", "ように思う", "にきまっている", "わけだ"],
    correctAnswerIndex: 0,
    explanation: "「でしょう」dùng để phỏng đoán: \"Có lẽ là...\"."
  },
  // 52
  {
    id: "gq-52",
    question: "あんなに勉強しなかったら、落ちる______。",
    options: ["にきまっている", "でしょう", "ように思う", "わけだ"],
    correctAnswerIndex: 0,
    explanation: "「にきまっている」nghĩa là \"Chắc chắn là...\" (suy đoán chắc nịch mang tính chủ quan)."
  },
  // 53
  {
    id: "gq-53",
    question: "外は雨が降っている______。",
    options: ["ようだ", "にきまっている", "でしょう", "わけだ"],
    correctAnswerIndex: 0,
    explanation: "「ようだ」dùng để phỏng đoán dựa trên cảm giác hoặc dấu hiệu khách quan."
  },
  // 54
  {
    id: "gq-54",
    question: "彼が犯人だなんて、信じ______。",
    options: ["がたい", "にくい", "っこない", "かねる"],
    correctAnswerIndex: 0,
    explanation: "「Vます + がたい」nghĩa là \"Khó có thể...\" (khó về mặt tâm lý, cảm xúc)."
  },
  // 55
  {
    id: "gq-55",
    question: "この肉は固くて食べ______。",
    options: ["にくい", "がたい", "っこない", "かねる"],
    correctAnswerIndex: 0,
    explanation: "「Vます + にくい」nghĩa là \"Khó làm gì đó\" (khó về mặt vật lý, thao tác)."
  },
  // 56
  {
    id: "gq-56",
    question: "あんなひどいこと、彼に言え______よ。",
    options: ["っこない", "がたい", "にくい", "かねる"],
    correctAnswerIndex: 0,
    explanation: "「Vます + っこない」nghĩa là \"Tuyệt đối không thể\" (phủ định mạnh mẽ mang tính chủ quan)."
  },
  // 57
  {
    id: "gq-57",
    question: "このカレーは辛すぎて、とても______。",
    options: ["食べられない", "食べっこない", "食べかねない", "食べがたい"],
    correctAnswerIndex: 0,
    explanation: "「とても + V khả năng dạng phủ định」nghĩa là \"Hoàn toàn không thể\"."
  },
  // 58
  {
    id: "gq-58",
    question: "お客様のご要望にはお応え______。",
    options: ["かねます", "がたいです", "にくいです", "っこないです"],
    correctAnswerIndex: 0,
    explanation: "「かねます」nghĩa là \"Không thể / Khó lòng mà\" (dùng để từ chối khéo trong văn bản/thương mại)."
  },
  // 59
  {
    id: "gq-59",
    question: "簡単な手術だから、心配する______。",
    options: ["ことはない", "わけではない", "ないことはない", "わけがない"],
    correctAnswerIndex: 0,
    explanation: "「Vる + ことはない」nghĩa là \"Không cần thiết phải...\" (đưa ra lời khuyên)."
  },
  // 60
  {
    id: "gq-60",
    question: "納豆は食べられ______が、あまり好きではない。",
    options: ["ないことはない", "ことはない", "わけではない", "わけがない"],
    correctAnswerIndex: 0,
    explanation: "「ないことはない」nghĩa là \"Không phải là không...\" (phủ định một phần)."
  },
  // 61
  {
    id: "gq-61",
    question: "合格できたので、嬉しくて______。",
    options: ["たまらない", "しかたがない", "ところだった", "わけがない"],
    correctAnswerIndex: 0,
    explanation: "「てたまらない」nghĩa là \"Vô cùng, rất (không chịu nổi)\"."
  },
  // 62
  {
    id: "gq-62",
    question: "今日は暑くて______。",
    options: ["しかたがない", "たまらない", "ところだった", "わけがない"],
    correctAnswerIndex: 0,
    explanation: "「てしかたがない」cũng có nghĩa \"Vô cùng, rất (không có cách nào khác)\"."
  },
  // 63
  {
    id: "gq-63",
    question: "もう少しで車にひかれる______。",
    options: ["ところだった", "わけではない", "ことになった", "つもりだった"],
    correctAnswerIndex: 0,
    explanation: "「ところだった」nghĩa là \"Suýt nữa thì...\" (một việc suýt xảy ra nhưng cuối cùng không xảy ra)."
  },
  // 64
  {
    id: "gq-64",
    question: "会議の時間は10時だった______。",
    options: ["っけ", "ものだ", "ことだ", "わけだ"],
    correctAnswerIndex: 0,
    explanation: "「～っけ」dùng để nhớ lại, xác nhận lại thông tin \"... nhỉ?\"."
  },
  // 65
  {
    id: "gq-65",
    question: "______、明日の天気はどうなるかな。",
    options: ["ところで", "のことなんですが", "ついでに", "それに"],
    correctAnswerIndex: 0,
    explanation: "「ところで」nghĩa là \"Nhân tiện, à này\" (dùng để chuyển sang chủ đề hoàn toàn mới)."
  },
  // 66
  {
    id: "gq-66",
    question: "来週の会議______、場所が変更になりました。",
    options: ["のことなんですが", "ところで", "ついでに", "について"],
    correctAnswerIndex: 0,
    explanation: "「～のことなんですが」nghĩa là \"Về chuyện...\" (dùng để đưa ra chủ đề muốn bàn)."
  },
  // 67
  {
    id: "gq-67",
    question: "出張で行く______、観光もしてきたい。",
    options: ["ついでに", "かわりに", "を中心に", "を通して"],
    correctAnswerIndex: 0,
    explanation: "「ついでに」nghĩa là \"Nhân tiện làm việc A thì làm luôn việc B\"."
  },
  // 68
  {
    id: "gq-68",
    question: "あのレストランは高い______、とても美味しい。",
    options: ["だけあって", "ことになって", "ところだった", "わけではない"],
    correctAnswerIndex: 0,
    explanation: "「だけあって」nghĩa là \"Quả đúng là... / Tương xứng với...\"."
  },
  // 69
  {
    id: "gq-69",
    question: "嬉しい______、宝くじに当たりました。",
    options: ["ことに", "だけあって", "ものだから", "おかげで"],
    correctAnswerIndex: 0,
    explanation: "「V/A ことに」nghĩa là \"Thật là...\" (nhấn mạnh cảm xúc người nói)."
  },
  // 70
  {
    id: "gq-70",
    question: "メールを送った______が、届いていなかったようだ。",
    options: ["つもりだ", "わけだ", "ものだ", "ことだ"],
    correctAnswerIndex: 0,
    explanation: "「Vた + つもりだ」có nghĩa là \"Cứ tưởng là đã... (nhưng thực tế không phải vậy)\". Đây là bẫy lớn."
  },
  // 71
  {
    id: "gq-71",
    question: "来月から東京へ転勤する______。",
    options: ["ことになった", "ことにした", "ことにしている", "ことになっている"],
    correctAnswerIndex: 0,
    explanation: "「ことになった」chỉ sự việc đã được quyết định bởi người khác hoặc yếu tố khách quan."
  },
  // 72
  {
    id: "gq-72",
    question: "彼はアニメの______、急によく話すようになる。",
    options: ["ことになると", "ことになった", "ことだから", "ことだ"],
    correctAnswerIndex: 0,
    explanation: "「ことになると」nghĩa là \"Cứ nói đến... là lại (có thái độ khác)\"."
  },
  // 73
  {
    id: "gq-73",
    question: "スポーツの______、彼に勝てる人はいない。",
    options: ["こととなると", "ことになると", "ことになった", "ことだから"],
    correctAnswerIndex: 0,
    explanation: "「こととなると」cũng có ý nghĩa tương tự 「ことになると」: \"Cứ hễ nói đến... là lại\"."
  },
  // 74
  {
    id: "gq-74",
    question: "申し訳ありませんが、今日は休ま______。",
    options: ["せていただきます", "せていただけませんか", "いたします", "ております"],
    correctAnswerIndex: 0,
    explanation: "「V使役 + せていただきます」nghĩa là \"Tôi xin phép được...\" (Kính ngữ)."
  }
];
