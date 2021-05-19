    document.getElementById('toggle-sb').addEventListener('click', function(){
        if (document.getElementById('sidebar').style.display == 'block'){
            document.getElementById('sidebar').style.display='none';
            document.getElementById('page-container').style.width='90%';
            document.getElementById('page-container').style.left="5%";
            document.getElementById('toggle-sb').style.left="0px";
            document.getElementById('search').style.left='37.5%';
            document.getElementById('icon-bar-back').style.width='100%';
            document.getElementById('icon-bar').style.width='100%';
            document.getElementById('icon-bar-back').style.left='0%';
            document.getElementById('icon-bar').style.left='0%';
        }else if (document.getElementById('sidebar').style.display == 'none'){
            document.getElementById('sidebar').style.display='block';
            document.getElementById('page-container').style.width='67.5%';
            document.getElementById('page-container').style.left="30%";
            document.getElementById('toggle-sb').style.left="24%";
            document.getElementById('search').style.left='0px';
            document.getElementById('icon-bar-back').style.width='73%';
            document.getElementById('icon-bar').style.width='73%';
            document.getElementById('icon-bar-back').style.left='27%';
            document.getElementById('icon-bar').style.left='27%';
        }
    });
    function display(page){
        document.getElementById(page+'Box').style.display='block';
        document.getElementById(page+'Btn').style.display='inline';
        document.getElementById(page+'CBtn').style.display='inline';
        document.getElementById('warn').style.display='none';
        document.getElementById('title').style.display='none';
        document.getElementById('page').style.display='none';
        document.getElementById('comments').style.display='none';
        document.getElementById('comment-container').style.display='none';
        document.getElementById(page+'Box').focus();

        if (page == 'edit'){
            document.getElementById('editBox').value = document.getElementById('page').contentDocument.body.innerHTML;
        }
        if (page == 'new'){
            document.getElementById('newTBox').style.display = 'block';
            
        }
    }
    function cancel(page){
        document.getElementById(page+'Box').style.display='none';
        document.getElementById(page+'Btn').style.display='none';
        document.getElementById(page+'CBtn').style.display='none';
        document.getElementById('newTBox').style.display='none';
        document.getElementById('warn').style.display='none';
        document.getElementById('title').style.display='block';
        document.getElementById('page').style.display='block';
        document.getElementById('comment-container').style.display='block';
    }
    function edit(tag){
        if (document.getElementById('newBox').style.display == 'block'){
            typeInTextarea(tag, 'newBox');
        }else{     
            if ((document.getElementById('warn').style.display == 'none')&&(document.getElementById('editBox').style.display=='none')){
                document.getElementById('warn').style.display = 'block';
            }else if (document.getElementById('editBox').style.display=='block'){
                typeInTextarea(tag, 'editBox');
            }else{
                alert('You must select either Y or N at the top of the page.');
            }
        }

    }
    let arg;
    let key;
    function typeInTextarea(entry, id){
        var textarea = document.getElementById(id);
        var len = textarea.value.length;
        var start = textarea.selectionStart;
        var end = textarea.selectionEnd;
        arg = '';
        key = '';

        if ((entry == 'a') || (entry == 'img')){
            if (entry == 'a'){
                key = 'href';
            }else{
                key = 'src';
            }
            arg = " "+key+' = "'+prompt("Please provide a URL for your hyperlink or image.")+'"';
        }

        var sel = textarea.value.substring(start, end);
        var replace = '<'+entry+arg+'>'+sel+'</'+entry+'>';
        textarea.value = textarea.value.substring(0,start) + replace +
        textarea.value.substring(end,len);
    }
    function button(url, data){
        $.ajax({
                type: "POST",
                url: url,
                data: 'PAGE'+window.location.href.split('?page=')[1]+'END'+data,
                dataType: "text/html"
        });
    }
    function list_pages(url){
        var pages_listed = [];
        var output_pages = [];
        var i = 0;

        var res = $.ajax({
                type: "GET",
                url: url,
                async: false,
                dataType: "text/html"
        });
        var to_array = (res.responseText.replaceAll('[','').replaceAll(']','').replaceAll('"',''));
        var pages_listed = to_array.split(',');

        while (i < pages_listed.length){
            output_pages.push(`<a href="javascript:window.open('`+window.location.href.split('?page=')[0]+`?page=`+pages_listed[i].replace('.html','')+`','_self')">`+pages_listed[i]+`</a><br>`);
            i++;
        }
        document.write(output_pages.join(''));

    }

    function random_page(){
        var output = [];
        var res = $.ajax({
                type: "GET",
                async: false,
                url: "/random",
                dataType: "text/html"
        });
        var all_pages = res.responseText.replaceAll('[','').replaceAll(']','');
        var results = all_pages.split(',');
        var rand_int = Math.floor(Math.random()*parseInt(results.length));
        window.open(window.location.href.split('?page=')[0]+'?page='+results[rand_int].replaceAll('"','').replaceAll('.html',''),'_self');
        
    }

    function buttonNew(url, data, title){
        $.ajax({
                type: "POST",
                url: url,
                data: 'PAGE'+title+'END'+data,
                dataType: "text/html"
        });
    }

    search_output = [];
    var default_bar = document.getElementById('sidebar').innerHTML;
    function searchTerm(term){
        var i = 0;
        var res = $.ajax({
                type: "POST",
                url: '/search',
                async:false,
                data: term,
                dataType: "text/html"
        });
        var to_string = res.responseText.replaceAll('"','').replaceAll('[','').replaceAll(']','');
        var results = to_string.split(',');
        var num = results.length;
        var num_of_return = 0;
        while (i < num){
            if (results[i].toLowerCase().includes((document.getElementById('search').value).toLowerCase())){
                num_of_return++;                  
                search_output.push('<a href="javascript:window.open(window.location.href.split(`?page=`)[0]+`?page='+results[i].replace('.html','')+'`,`_self`)">'+results[i]+'</a><br>');
                document.getElementById('sidebar').innerHTML = (search_output).join('')+`<br><br>
                    Returned `+num_of_return+` results out of `+(num)+` pages.`;          
            }
            i++;
        }
    }

    document.getElementById('page').addEventListener('load',function(){
        var scroll = document.getElementById('page').contentWindow.document.body.scrollHeight;
        document.getElementById('page').style.height = scroll+'px';
    });
    document.addEventListener('click',function(){
        document.getElementById('sidebar').innerHTML = default_bar;
    });
