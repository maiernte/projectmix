declare enum BookType {
    Gua = 0,
    Ming = 1,
    Person = 2
};

declare type Book = {
    _id?: string,
    name: string,
    description?: string,
    type: BookType,
    icon?: string,
    owner?: string,
    readpermission: number,
    writepermission: number,
    author?: string,
}