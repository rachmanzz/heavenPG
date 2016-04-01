# heavenPG
jQuery Pagination with bootstrap style
##Initialize the plugin
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" 

    <script src="//code.jquery.com/jquery-1.12.0.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
    <script src="dist/heavenpg.min.js"></script>
        
## Usage
    var heaven= heavenPG({
        id : 'ul#pagnition',
        total: 10, // page total
        onclick:function(page,event){
                    console.log(page); // page number clicked
                }
    });
    heaven.execute();
    
### change total page
    heaven.makeChange(16); // make change total page
    
## other function
|Method|type| 
|---|---|
|.id(data)|string|
|.data(data)|object|
    
### option
|Method|type| default | require |
|---|---|---|---|
|id|string|none|require|
|total|number|1|require|
|onclick|function|none|require|
|visible|number|5|optional|
|pgLength|number|3|optional|
|next|string|next|optional|
|prev|string|prev|optional|
|current|number|1|optional|
