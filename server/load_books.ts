import {Books, LocalRecords} from 'collections/books'

export function loadBooks() {
    Books.find();
    LocalRecords.find();
    
    /*if (Books.find().count() === 0) {
    
    var books = [
        {
            'name': '六爻卦集',
            'description': '系统自动创建的第一本个人卦集。',
            'type': 0
        },
        {
            'name': '八字命集',
            'description': '系统自动创建的第一本个人命集。',
            'type': 1
        },
        {
            'name': '易学档案',
            'description': '由系统创建的第一本个人档案。',
            'type': 2
        }
    ];
    
    try{
        for (var i = 0; i < books.length; i++) {
            Books.insert(books[i]);
        }
    }catch(err){
        console.log('Fehler bei loadBooks', err)
    }
    }*/
};