		/* ---------------------------------------------------------------------------------------------------- */
	/*
		{
			href:'/url',title:'Title',icon: "dashboard",
            apiname:'apiname',viewfolder:'models',tablename:'tablename',
            managers:{categories:{name:'categories',id:'id' },
            image_gallery:{name:'image_gallery',id:'id' },
            lookups:{name:'lookups',id:'id',filter:[{field: 'lookups.type_id',value:'2',op: 'eq'}] } } ,
            allowadd:false,allowrefresh:false,allowview:true,
            enabled : true ,
            sort:1,
			tabs:[
				{
					name:'Info' ,fields:[
					{field:'full_name',name:'Full Name',type:'text' ,search:true },
					{field:'email',name:'Email',type:'email'},
					{field:'phone',name:'Phone',type:'text'},
					{field:'guest_number',name:'Guest Number',type:'text'},
					{field:'from_date',name:'From Date',type:'datetime'},
					{field:'status',name:'Status',type:'checkbox'},
					{field:'description',name:'Description',type:'textarea'}
                    {field:'parent_id',name:'Parent',type:'ui-select',
                        managername:'categories',managerid:'id',showfields:['name_en','name_ar'],searchfields:[{
                                                                            field: 'categories.name_en',
                                                                            op: 'like'
                                                                        },{
                                                                            field: 'categories.name_ar',
                                                                            op: 'orlike'
                                                                        }]
                        },
					grids:[
						{name:'table' ,field:'reserve_tables' ,
						 fields:[
							{field:'full_name',name:'Full Name',type:'text' },
							{field:'email',name:'Email',type:'email'},
							{field:'phone',name:'Phone',type:'text'},
							{field:'guest_number',name:'Guest Number',type:'text'},
							{field:'from_date',name:'From Date',type:'datetime'},
							{field:'status',name:'Status',type:'checkbox'},
							{field:'description',name:'Description',type:'textarea'}
						]}
					]
					]}
			]
		}
	 */


var modulesDef = {

};

  