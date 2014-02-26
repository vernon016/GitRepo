addField = function(evt) {
    evt.stopPropagation(); //stops the document click action
    var element = $(this);
    element.off('click');
    var parent = element.parent();
    var currentText = element.html();

    if ($(this).attr('class') == 'selected') {    
        var inputTemplate = "<input id='field' type='text' value='" + currentText + "' />";
        element.html(inputTemplate);
        parent.find("input").focus();
    }
    else {
        if (element.attr('fid') == 0) {
            var inputTemplate = "<input id='field' type='text' />";
            element.html(inputTemplate);
            parent.find("input").focus();
        }
        else{
            element.on('click', addField);
        }

        $(this).siblings().removeClass('selected');
        $(this).toggleClass('selected');
    }

    setTimeout(function(){
        $('#field').on('keydown',keyPressEvent);
        $('#field').on('escape',function(){
            element.text(currentText);
            element.on('click', addField);
        });
        $('#field').blur(function() {
            element.text(currentText);
            element.on('click', addField);
        });
        $('#field').on('enter',function(){
            var inputVal = $('#field').val();
            para = {};
            para['module'] = 'student';
            para['mode'] = 'update_student_custom_field';
            para['id'] = element.attr('fid');
            para['field'] = 'name';
            para['data'] = inputVal;
            $.post('servicehandler/', para, function(rv){
                var result = $.parseJSON(rv);
                // var result = {"post":{"module":"student","mode":"update_student_custom_field","id":"0","field":"name","data":"Guardians","subdomain":"vernon","userid":""},"success":1,"data":{"id":7}};
                if (result.success == 1)
                {
                    element.text(inputVal);
                    element.addClass('selected');
                    element.on('click', addField);

                    if (element.attr('fid') == 0) {
                        var id = result.data.id;
                        element.removeClass('newfield');
                        element.attr('fid', id);
                        element.attr('for', id);

                        $('#main').append(GenerateTemplateforValueContainer(id));
                        parent.append(GenerateTemplateforNewField());
                
                        $('#sidebar label.newfield').on('click', addField);
                        $('#main div.newcontainer div article p.newvalue').on('click', addFieldValue);
                        $('#main div.newcontainer div input:radio[name=tabcontrol-1]').attr('checked',true);
                        $('#main div.newcontainer').removeClass('newcontainer');
                    }
                }
            });
        });
    },10);
}

addFieldValue = function(evt) {
    evt.stopPropagation();
    var element = $(this);
    element.off('click');
    var parent = element.parent();
    var currentText = element.html();

    var inputTemplate;
    if (element.attr('cdid') == 0)
    {
        inputTemplate = "<input id='value' type='text' />";
    }
    else
    {
        inputTemplate = "<input id='value' type='text' value='" + currentText + "' />";
    }

    element.html(inputTemplate);
    parent.find("input").focus();

    setTimeout(function(){
        $('#value').on('keydown',keyPressEvent);
        $('#value').on('escape',function(){
            element.text(currentText);
            element.on('click', addFieldValue);
        });
        $('#value').blur(function() {
          element.text(currentText);
          element.on('click', addFieldValue);
        });
        $('#value').on('enter',function(){
            var inputVal = $('#value').val();
            para = {};
            para['module'] = 'student';
            para['mode'] = 'update_student_custom_data';
            para['cdid'] = element.attr('cdid');
            para['studentid'] = 1;
            para['cfid'] = element.parent().attr('fid');
            para['newcd'] = inputVal;
            $.post('servicehandler/', para, function(rv){
                var result = $.parseJSON(rv);
                // var result = {"success":1,"cdid":1};

                if (result.success == 0)
                {
                    alert(result.info.err);
                    element.text(currentText);
                    element.on('click', addFieldValue);
                }
                else
                {
                    element.text(inputVal);
                    if (element.attr('cdid') == 0)
                    {
                        element.attr('cdid', result.cdid);
                        element.removeClass('newvalue');
                        parent.append(GenerateTemplateforNewValue());
                        parent.children('p.newvalue').on('click', addFieldValue);
                    }
                    element.on('click', addFieldValue);
                }
            });
        });
    },10);
}

keyPressEvent = function(e) {
    if (e.which==13) { $(this).trigger('enter'); }
    if (e.which==27) { $(this).trigger('escape'); }
}

function GenerateTemplateforNewField() {
    var text = "<br><label fid='0' class='newfield'>Click to add new field</label>";
    return text;
}

function GenerateTemplateforValueContainer(id) {
    var text = "";
    text += "<div class='newcontainer'>";
    text +=     "<div>";
    text +=         "<input id='" + id + "' name='tabcontrol-1' type='radio' />";
    text +=         "<article fid='" + id +"' id='content-" + id + "'>";
    text +=             "<p cdid='0' class='newvalue'>Click to add new value</p>";
    text +=         "</article>";
    text +=     "</div>";
    text += "</div>";
    return text;
}

function GenerateTemplateforNewValue() {
    var text = "";
    text += "<p cdid='0' class='newvalue'>Click to add new value</p>";
    return text;    
}

$(function() { 
    var fieldData;
    // para = {};
    // para['module'] = 'student';
    // para['mode'] = 'get_student_custom_data';
    // para['studentid'] = 1;
    // $.post('servicehandler/', para, function(rv){
    //     fieldData = $.parseJSON(rv);
    
    //     para = {};
    //     para['module'] = 'student';
    //     para['mode'] = 'get_student_custom_field';
    //     $.post('servicehandler/', para, function(rv){
    //         var data = $.parseJSON(rv);
            fieldData = {"info":{"datacount":4},"data":{"fid":["1","2","4","3"],"fname":["Allergy","Doctor","Chess Ranking","Doctor Telephone"],"cdid":["1","2","3","4"],"cd":["penicilin","Dr Chiang","Grand Master","67837763"]},"success":1};
            data = {"data":[{"id":"1","name":"Allergy","val":"[\"Pol\",\"Bel\",\"Sel\"]","o":"1","locid":"1"},{"id":"18","name":"Shirt Size","val":"[\"XS\",\"S\",\"M\",\"L\",\"XL\"]","o":"0","locid":"1"}],"success":1,"info":{"datacount":2}};
            $(data.data).each(function (index, element) {

                var field = "";
                if (index == 0)
                    field = "<label fid='" + element.id + "' class='selected' for='" + element.id +"'>"+ element.name +"</label>";
                else
                    field = "<label fid='" + element.id + "' for='" + element.id +"'>"+ element.name +"</label>";

                $('#sidebar').append(field);

                var fieldDataItem = $.parseJSON(element.val);
                for (var i = 0; i < fieldData.info.datacount; i++)
                {
                    if (fieldData.data.fid[i] == element.id)
                    {
                        fieldDataItem += "<p cdid='" + fieldData.data.cdid[i] + "'>" + fieldData.data.cd[i] + "</p>";
                    }
                }

                var fieldDataTemplate = "";
                fieldDataTemplate += "<div>";
                fieldDataTemplate +=    "<div>";

                 if (index == 0)
                    fieldDataTemplate +=    "<input id='" + element.id +"' name='tabcontrol-1' type='radio' checked />";
                else
                    fieldDataTemplate +=    "<input id='" + element.id +"' name='tabcontrol-1' type='radio' />";
                        
                fieldDataTemplate +=        "<article fid='" + element.id +"' id='content-'" + element.id +">";
                fieldDataTemplate +=            fieldDataItem;
                fieldDataTemplate +=            "<p cdid='0' class='newvalue'>Click to add new value</p>";            
                fieldDataTemplate +=        "</article>";
                fieldDataTemplate +=    "</div>";
                fieldDataTemplate += "</div>";

                $('#main').append(fieldDataTemplate);
            });
            
            $('#sidebar').append("<label fid='0' class='newfield'>Click to add new field</label>");
            $('#sidebar label').on('click', addField);
            $('#main div div article p').on('click', addFieldValue);
    //     });
    // });
});
        