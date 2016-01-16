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
};

declare type YiGua = {
    time?: Date,
    yueri: Array<string>,
    ben: string,
    bian: string,
    type: string
};

declare type YiBazi = {
    time: Date,
    gender: string,
    place?: string,
    solartime?: string,
    bazi: string
};

// flag = 0 Gua; flag = 1 Bazi
declare type YiRecord = {
    _id?: string,
    _book?: string,
    gua?: YiGua,
    bazi?: YiBazi,
    question: string,
    description?: string,
    owner?: string,
    feed: string,
    created: number,
    modified: number,
}