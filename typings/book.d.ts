declare type Book = {
    _id?: string,
    name: string,
    description?: string,
    icon?: string,
    owner?: string,
    readpermission: number,
    writepermission: number,
    author?: string,
    created: number,
    modified: number,
}