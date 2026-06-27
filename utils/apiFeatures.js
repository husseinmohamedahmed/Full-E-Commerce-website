class ApiFeatures{
   
    constructor(mongooseQuery,mongooseString){
        this.mongooseQuery=mongooseQuery;
        this.mongooseString=mongooseString;
    }

    filter(){
    let query={...this.mongooseString};
    const excludedFields=['page','limit','sort','fields','keyword'];
    excludedFields.forEach((field)=>{
        delete query[field];
    })
   query=JSON.stringify(query);
   query= query.replace(/\b(gt|gte|lt|lte)\b/g,(match)=>`$${match}`);
    query=JSON.parse(query);
      this.mongooseQuery=this.mongooseQuery.find(query);
      return this;
    }
  
    sort(){
        if(this.mongooseString.sort){
    const sortBy=this.mongooseString.sort.split(',').join(' ');
     this.mongooseQuery=this.mongooseQuery.sort(sortBy)
 }else{
        this.mongooseQuery=this.mongooseQuery.sort("-createdAt")
 } 

  return this;
    }

limitFields(){
    let fields
     if(this.mongooseString.fields){
         fields=this.mongooseString.fields.split(',').join(' ');
        this.mongooseQuery=this.mongooseQuery.select(fields);
     }
     else{
        fields="-__v"
        this.mongooseQuery=this.mongooseQuery.select(fields);
     }  
     return this; 
}

search(modelName){
    if(this.mongooseString.keyword){
        let query={};
        if(modelName==='products'){
        query.$or=[
            {title:{$regex: this.mongooseString.keyword,$options:'i'}},
            {description:{$regex: this.mongooseString.keyword,$options:'i'}}
        ];}
        else{
            query.$or=[
            {name:{$regex: this.mongooseString.keyword,$options:'i'}} 
      ]  }
        this.mongooseQuery=this.mongooseQuery.find(query);
        
     };
     return this;
}

paginate(documentsNumber){
    const page=Number(this.mongooseString.page) || 1;
    const limit=Number(this.mongooseString.limit) || 3;
    const skip=(page-1)*limit;
    const endIndex=page*limit;
    let pagination={};
    pagination.currentPage=page;
    pagination.numberOfPages=Math.ceil(documentsNumber/limit);
    if(endIndex<documentsNumber){
        pagination.next=page+1;
    }
    if(skip>0){
        pagination.prev=page-1;
    }
    this.mongooseQuery=this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResults=pagination;
    return this;
}
}

module.exports=ApiFeatures;
