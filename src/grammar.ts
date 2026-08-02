import { GrammarCategory } from './types';

export const grammarData: GrammarCategory[] = [
    {
        id: 'cat-1',
        title: 'I. SO SÁNH',
        points: [
            {
                id: 'g-1-1',
                pattern: 'に比べ（て）',
                structure: 'N + に比べ（て）',
                meaning: 'So với...',
                group: '1. So sánh giữa hai đối tượng'
            },
            {
                id: 'g-1-2',
                pattern: 'にしては',
                structure: '普通形 + にしては',
                meaning: 'So với... thì...',
                nuance: 'Kết quả trái mong đợi',
                note: 'Bẫy: 子どもにしては日本語が上手だ ≠ に比べ',
                group: '2. So sánh trái với kỳ vọng'
            },
            {
                id: 'g-1-3',
                pattern: 'わりに',
                structure: '普通形 + わりに',
                meaning: 'So với...',
                nuance: 'Trung tính hơn (ngoài JLPT)',
                group: '2. So sánh trái với kỳ vọng'
            }
        ]
    },
    {
        id: 'cat-2',
        title: 'II. GIỐNG NHAU',
        points: [
            {
                id: 'g-2-1',
                pattern: 'のように',
                structure: 'N + のように',
                meaning: 'giống như (V)',
                nuance: 'dùng với động từ'
            },
            {
                id: 'g-2-2',
                pattern: 'のような',
                structure: 'N + のような + N',
                meaning: 'giống như (N)',
                nuance: 'bổ nghĩa danh từ'
            },
            {
                id: 'g-2-3',
                pattern: 'みたいに',
                structure: 'N + みたいに',
                meaning: 'giống như',
                nuance: 'khẩu ngữ'
            },
            {
                id: 'g-2-4',
                pattern: 'みたいな',
                structure: 'N + みたいな',
                meaning: 'giống như',
                nuance: 'khẩu ngữ'
            }
        ]
    },
    {
        id: 'cat-3',
        title: 'III. DỰA TRÊN',
        points: [
            {
                id: 'g-3-1',
                pattern: 'をもとに',
                structure: 'N + をもとに',
                meaning: 'dựa trên'
            },
            {
                id: 'g-3-2',
                pattern: 'に基づいて',
                structure: 'N + に基づいて',
                meaning: 'căn cứ vào',
                nuance: 'chính thức'
            }
        ]
    },
    {
        id: 'cat-4',
        title: 'IV. NGUYÊN NHÂN',
        points: [
            {
                id: 'g-4-1',
                pattern: 'おかげで',
                structure: '普通形 + おかげで',
                meaning: 'Nhờ có...',
                group: 'Nguyên nhân tích cực'
            },
            {
                id: 'g-4-2',
                pattern: 'せいで',
                structure: '普通形 + せいで',
                meaning: 'Tại vì...',
                group: 'Nguyên nhân tiêu cực'
            },
            {
                id: 'g-4-3',
                pattern: 'せいか',
                structure: '普通形 + せいか',
                meaning: 'Có lẽ là do...',
                group: 'Phỏng đoán nguyên nhân'
            },
            {
                id: 'g-4-4',
                pattern: 'せいだ',
                structure: '普通形 + せいだ',
                meaning: 'Chắc chắn là do...',
                group: 'Khẳng định nguyên nhân'
            },
            {
                id: 'g-4-5',
                pattern: 'ものだから',
                structure: '普通形 + ものだから',
                meaning: 'Bởi vì...',
                group: 'Giải thích lịch sự'
            },
            {
                id: 'g-4-6',
                pattern: 'ものですから',
                structure: '普通形 + ものですから',
                meaning: 'Bởi vì...',
                group: 'Giải thích lịch sự'
            },
            {
                id: 'g-4-7',
                pattern: 'もので',
                structure: '普通形 + もので',
                meaning: 'Bởi vì...',
                group: 'Giải thích lịch sự'
            },
            {
                id: 'g-4-8',
                pattern: 'ことから',
                structure: '普通形 + ことから',
                meaning: 'Vì (sự thật)... nên...',
                group: 'Căn cứ để suy luận'
            },
            {
                id: 'g-4-9',
                pattern: 'からして',
                structure: 'N + からして',
                meaning: 'Ngay từ... (đã)',
                group: 'Căn cứ để suy luận'
            }
        ]
    },
    {
        id: 'cat-5',
        title: 'V. ĐIỀU KIỆN',
        points: [
            {
                id: 'g-5-1',
                pattern: '限り',
                structure: '普通形 + 限り',
                meaning: 'miễn là'
            },
            {
                id: 'g-5-2',
                pattern: '限りは',
                structure: '普通形 + 限りは',
                meaning: 'chừng nào còn'
            },
            {
                id: 'g-5-3',
                pattern: 'ない限り',
                structure: 'Vない + 限り',
                meaning: 'nếu không...'
            }
        ]
    },
    {
        id: 'cat-6',
        title: 'VI. CHUẨN BỊ',
        points: [
            {
                id: 'g-6-1',
                pattern: 'に備えて',
                structure: 'N + に備えて',
                meaning: 'chuẩn bị cho...'
            }
        ]
    },
    {
        id: 'cat-7',
        title: 'VII. THAY THẾ',
        points: [
            {
                id: 'g-7-1',
                pattern: 'の代わりに',
                structure: 'N + の代わりに',
                meaning: 'thay thế, đổi lại'
            },
            {
                id: 'g-7-2',
                pattern: 'に代わって',
                structure: 'N + に代わって',
                meaning: 'thay mặt'
            },
            {
                id: 'g-7-3',
                pattern: 'に代わり',
                structure: 'N + に代わり',
                meaning: 'thay vì, thay mặt',
                nuance: 'văn viết'
            }
        ]
    },
    {
        id: 'cat-8',
        title: 'VIII. TRUNG TÂM',
        points: [
            {
                id: 'g-8-1',
                pattern: 'を中心に',
                structure: 'N + を中心に',
                meaning: 'lấy N làm trung tâm'
            },
            {
                id: 'g-8-2',
                pattern: 'を中心として',
                structure: 'N + を中心として',
                meaning: 'lấy N làm trung tâm'
            }
        ]
    },
    {
        id: 'cat-9',
        title: 'IX. LIỆT KÊ',
        points: [
            {
                id: 'g-9-1',
                pattern: 'をはじめ',
                structure: 'N + をはじめ',
                meaning: 'tiêu biểu là'
            },
            {
                id: 'g-9-2',
                pattern: 'をはじめとして',
                structure: 'N + をはじめとして',
                meaning: 'tiêu biểu là',
                nuance: 'trang trọng'
            },
            {
                id: 'g-9-3',
                pattern: 'はもちろん',
                structure: 'N + はもちろん',
                meaning: 'không chỉ'
            },
            {
                id: 'g-9-4',
                pattern: 'はもとより',
                structure: 'N + はもとより',
                meaning: 'không chỉ',
                nuance: 'trang trọng hơn'
            }
        ]
    },
    {
        id: 'cat-10',
        title: 'X. THÔNG QUA',
        points: [
            {
                id: 'g-10-1',
                pattern: 'を通して',
                structure: 'N + を通して',
                meaning: 'thông qua (việc gì đó)'
            },
            {
                id: 'g-10-2',
                pattern: 'を通じて',
                structure: 'N + を通じて',
                meaning: 'thông qua (việc gì đó)',
                note: 'Hai mẫu gần như tương đương.'
            }
        ]
    },
    {
        id: 'cat-11',
        title: 'XI. VAI TRÒ',
        points: [
            {
                id: 'g-11-1',
                pattern: 'として',
                structure: 'N + として',
                meaning: 'với tư cách là, với vai trò là'
            }
        ]
    },
    {
        id: 'cat-12',
        title: 'XII. TẦN SUẤT',
        points: [
            {
                id: 'g-12-1',
                pattern: 'たびに',
                structure: 'V + たびに',
                meaning: 'mỗi lần đều'
            },
            {
                id: 'g-12-2',
                pattern: 'うちに',
                structure: 'V + うちに',
                meaning: 'trong lúc'
            },
            {
                id: 'g-12-3',
                pattern: 'につけ',
                structure: 'V + につけ',
                meaning: 'hễ... là...'
            }
        ]
    },
    {
        id: 'cat-13',
        title: 'XIII. ĐỒNG THỜI',
        points: [
            {
                id: 'g-13-1',
                pattern: 'とともに',
                structure: 'V/N + とともに',
                meaning: 'cùng với, đồng thời với'
            },
            {
                id: 'g-13-2',
                pattern: 'ながら',
                structure: 'V + ながら',
                meaning: 'vừa... vừa...'
            },
            {
                id: 'g-13-3',
                pattern: 'ながらも',
                structure: 'V + ながらも',
                meaning: 'tuy... nhưng / mặc dù... nhưng'
            }
        ]
    },
    {
        id: 'cat-14',
        title: 'XIV. MỨC ĐỘ',
        points: [
            {
                id: 'g-14-1',
                pattern: 'ほど',
                structure: 'ほど',
                meaning: 'đến mức'
            },
            {
                id: 'g-14-2',
                pattern: 'くらい',
                structure: 'くらい',
                meaning: 'khoảng, đến mức'
            },
            {
                id: 'g-14-3',
                pattern: 'ぐらい',
                structure: 'ぐらい',
                meaning: 'khoảng, đến mức',
                nuance: 'khẩu ngữ'
            }
        ]
    },
    {
        id: 'cat-15',
        title: 'XV. NHẤN MẠNH',
        points: [
            {
                id: 'g-15-1',
                pattern: 'さえ',
                structure: 'N + さえ',
                meaning: 'ngay cả, đến cả'
            },
            {
                id: 'g-15-2',
                pattern: 'まで',
                structure: 'N + まで',
                meaning: 'đến tận',
                note: 'ngoài bài'
            }
        ]
    },
    {
        id: 'cat-16',
        title: 'XVI. KHÔNG PHẢI...',
        points: [
            {
                id: 'g-16-1',
                pattern: 'わけではない',
                structure: '普通形 + わけではない',
                meaning: 'không hẳn là, không có nghĩa là'
            },
            {
                id: 'g-16-2',
                pattern: 'わけじゃない',
                structure: '普通形 + わけじゃない',
                meaning: 'không hẳn là, không có nghĩa là'
            }
        ]
    },
    {
        id: 'cat-17',
        title: 'XVII. SUY LUẬN',
        points: [
            {
                id: 'g-17-1',
                pattern: 'わけだ',
                structure: '普通形 + わけだ',
                meaning: 'thảo nào, hèn chi, nghĩa là'
            },
            {
                id: 'g-17-2',
                pattern: 'というわけだ',
                structure: '普通形 + というわけだ',
                meaning: 'nghĩa là'
            }
        ]
    },
    {
        id: 'cat-18',
        title: 'XVIII. SUY ĐOÁN',
        points: [
            {
                id: 'g-18-1',
                pattern: 'ように思う',
                structure: 'ように思う',
                meaning: 'có vẻ như, tôi nghĩ rằng',
                nuance: 'ý kiến cá nhân'
            },
            {
                id: 'g-18-2',
                pattern: 'でしょう',
                structure: 'でしょう',
                meaning: 'có lẽ'
            },
            {
                id: 'g-18-3',
                pattern: 'にきまっている',
                structure: 'にきまっている',
                meaning: 'chắc chắn'
            },
            {
                id: 'g-18-4',
                pattern: 'ようだ',
                structure: 'ようだ',
                meaning: 'có vẻ',
                note: 'ngoài bài'
            }
        ]
    },
    {
        id: 'cat-19',
        title: 'XIX. KHÔNG THỂ',
        points: [
            {
                id: 'g-19-1',
                pattern: 'がたい',
                structure: 'Vます + がたい',
                meaning: 'khó (về mặt tâm lý)',
                group: 'Không thể về khả năng'
            },
            {
                id: 'g-19-2',
                pattern: 'にくい',
                structure: 'Vます + にくい',
                meaning: 'khó (về mặt vật lý)',
                note: 'ngoài bài',
                group: 'Không thể về khả năng'
            },
            {
                id: 'g-19-3',
                pattern: 'っこない',
                structure: 'Vます + っこない',
                meaning: 'tuyệt đối không thể',
                group: 'Không thể tuyệt đối'
            },
            {
                id: 'g-19-4',
                pattern: 'とても～ない',
                structure: 'とても V可能ない',
                meaning: 'hoàn toàn không thể',
                group: 'Không thể tuyệt đối'
            },
            {
                id: 'g-19-5',
                pattern: 'かねる / かねます',
                structure: 'Vます + かねる／かねます',
                meaning: 'khó lòng mà, không thể',
                group: 'Không thể tuyệt đối'
            }
        ]
    },
    {
        id: 'cat-20',
        title: 'XX. KHUYÊN',
        points: [
            {
                id: 'g-20-1',
                pattern: 'ことはない',
                structure: 'Vる + ことはない',
                meaning: 'không cần thiết phải...'
            }
        ]
    },
    {
        id: 'cat-21',
        title: 'XXI. PHỦ ĐỊNH MỘT PHẦN',
        points: [
            {
                id: 'g-21-1',
                pattern: 'ないことはない',
                structure: 'Vない + ことはない',
                meaning: 'không phải là không...'
            }
        ]
    },
    {
        id: 'cat-22',
        title: 'XXII. CẢM XÚC',
        points: [
            {
                id: 'g-22-1',
                pattern: 'てたまらない',
                structure: 'Vて + たまらない',
                meaning: 'rất, vô cùng (không chịu nổi)'
            },
            {
                id: 'g-22-2',
                pattern: 'てしかたがない',
                structure: 'Vて + しかたがない',
                meaning: 'rất, vô cùng (không thể nào khác)',
                note: 'ngoài bài'
            }
        ]
    },
    {
        id: 'cat-23',
        title: 'XXIII. SUÝT XẢY RA',
        points: [
            {
                id: 'g-23-1',
                pattern: 'ところだった',
                structure: 'Vる + ところだった',
                meaning: 'suýt nữa thì...'
            }
        ]
    },
    {
        id: 'cat-24',
        title: 'XXIV. NHỚ LẠI',
        points: [
            {
                id: 'g-24-1',
                pattern: 'っけ',
                structure: '～っけ',
                meaning: '... nhỉ?'
            }
        ]
    },
    {
        id: 'cat-25',
        title: 'XXV. CHUYỂN CHỦ ĐỀ',
        points: [
            {
                id: 'g-25-1',
                pattern: 'ところで',
                structure: 'ところで',
                meaning: 'nhân tiện, à này (chuyển sang chủ đề hoàn toàn mới)'
            },
            {
                id: 'g-25-2',
                pattern: 'のことなんですが',
                structure: '～のことなんですが',
                meaning: 'về chuyện... (đưa ra chủ đề muốn bàn)'
            }
        ]
    },
    {
        id: 'cat-26',
        title: 'XXVI. NHÂN TIỆN',
        points: [
            {
                id: 'g-26-1',
                pattern: 'ついでに',
                structure: 'Vる／Nの + ついでに',
                meaning: 'nhân tiện làm việc A, làm luôn việc B'
            }
        ]
    },
    {
        id: 'cat-27',
        title: 'XXVII. ĐÁNH GIÁ',
        points: [
            {
                id: 'g-27-1',
                pattern: 'だけあって',
                structure: 'だけあって',
                meaning: 'quả đúng là...'
            },
            {
                id: 'g-27-2',
                pattern: 'ことに',
                structure: 'ことに',
                meaning: 'thật là... (nhấn mạnh cảm xúc)'
            }
        ]
    },
    {
        id: 'cat-28',
        title: 'XXVIII. Ý ĐỊNH NHẦM',
        points: [
            {
                id: 'g-28-1',
                pattern: 'つもりだ',
                structure: 'Vた + つもりだ',
                meaning: 'cứ tưởng là... (thực tế thì không phải vậy)',
                note: 'Bẫy lớn: Đây là "cứ tưởng là...", không phải "dự định" (V辞書形 + つもりだ).'
            }
        ]
    },
    {
        id: 'cat-29',
        title: 'XXIX. QUYẾT ĐỊNH',
        points: [
            {
                id: 'g-29-1',
                pattern: 'ことになった',
                structure: 'ことになった',
                meaning: 'đã được quyết định (bởi người khác/yếu tố khách quan)'
            }
        ]
    },
    {
        id: 'cat-30',
        title: 'XXX. LIÊN QUAN ĐẾN',
        points: [
            {
                id: 'g-30-1',
                pattern: 'ことになると',
                structure: 'ことになると',
                meaning: 'cứ nói đến... là lại'
            },
            {
                id: 'g-30-2',
                pattern: 'こととなると',
                structure: 'こととなると',
                meaning: 'cứ nói đến... là lại'
            }
        ]
    },
    {
        id: 'cat-31',
        title: 'XXXI. KÍNH NGỮ',
        points: [
            {
                id: 'g-31-1',
                pattern: 'せていただけませんか',
                structure: 'V使役 + せていただけませんか',
                meaning: 'cho phép tôi... có được không?',
                group: 'Xin phép'
            },
            {
                id: 'g-31-2',
                pattern: 'せていただきます',
                structure: 'V使役 + せていただきます',
                meaning: 'xin phép được...',
                group: 'Xin phép'
            },
            {
                id: 'g-31-3',
                pattern: 'いたします',
                structure: 'お + Vます + いたします',
                meaning: 'tôi sẽ làm... (khiêm nhường ngữ)',
                group: 'Khiêm nhường ngữ'
            },
            {
                id: 'g-31-4',
                pattern: 'いたします',
                structure: 'ご + N + いたします',
                meaning: 'tôi sẽ làm... (khiêm nhường ngữ)',
                group: 'Khiêm nhường ngữ'
            },
            {
                id: 'g-31-5',
                pattern: 'ております',
                structure: 'Vております',
                meaning: 'đang làm... (khiêm nhường ngữ của ている)',
                group: 'Khiêm nhường ngữ'
            }
        ]
    },
    {
        id: 'cat-32',
        title: 'XXXII. CÁC NHÓM "BẪY" DỄ NHẦM TRONG QUIZ',
        points: [
            {
                id: 'g-32-1',
                pattern: 'So sánh',
                meaning: 'に比べ・にしては・ほど・くらい'
            },
            {
                id: 'g-32-2',
                pattern: 'Nguyên nhân',
                meaning: 'おかげで・せいで・せいか・せいだ・ものだから・ことから・からして'
            },
            {
                id: 'g-32-3',
                pattern: 'Điều kiện',
                meaning: '限り・限りは・ない限り'
            },
            {
                id: 'g-32-4',
                pattern: 'Thay thế',
                meaning: 'の代わりに・に代わって'
            },
            {
                id: 'g-32-5',
                pattern: 'Liệt kê',
                meaning: 'をはじめ・はもちろん・はもとより'
            },
            {
                id: 'g-32-6',
                pattern: 'Thông qua',
                meaning: 'を通して・を通じて'
            },
            {
                id: 'g-32-7',
                pattern: 'Khả năng',
                meaning: 'がたい・にくい・っこない・とても～ない・かねます'
            },
            {
                id: 'g-32-8',
                pattern: 'Suy luận / Suy đoán',
                meaning: 'ように思う・でしょう・にきまっている・わけだ'
            },
            {
                id: 'g-32-9',
                pattern: 'Phủ định',
                meaning: 'わけではない・ないことはない・ことはない'
            },
            {
                id: 'g-32-10',
                pattern: 'Tần suất',
                meaning: 'たびに・うちに・につけ'
            },
            {
                id: 'g-32-11',
                pattern: 'Cảm xúc',
                meaning: 'おかげで・せいで・くせに・てたまらない'
            },
            {
                id: 'g-32-12',
                pattern: 'Kính ngữ',
                meaning: 'させていただきます・ております・いたします・かねます'
            }
        ]
    }
];
