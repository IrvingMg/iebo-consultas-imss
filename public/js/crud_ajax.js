
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}


$(document).ready(function(){
    $("#descargar").click(function(){
        var boxes = document.getElementsByName("afiliadosId[]");
        let afiliadosId = [];
        for (var i=0; i < boxes.length; i++) {
            if (boxes[i].checked) 
            {
                afiliadosId.push(boxes[i].value);
            }
        }
        
        if(afiliadosId.length == 0) {
            $("#alerta-error").show()

            return;
        }

        $.ajax({
            url: "/afiliados/download",
            type: 'post',
            data: {
                ids: afiliadosId
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            dataType: 'json',
            success: function (result) {
                download(new Date(), result);
            }
        });
    });

    $("body").on("click", function(e){
        if($(e.target).is(".btn-registrar")) {
            e.preventDefault();
            
            $.ajax({
                url: $("#form-reg").attr('action'),
                type: 'post',
                data: $("#form-reg").serialize(),
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                dataType: 'json',
                success: function (result) {
                    $('#regModal').modal('hide');
                    $("#alerta-exito").append(result['success']);
                    $("#alerta-exito").show()
                    setTimeout(function () { document.location.reload(true); }, 750);
                }
            });

        } 

        if($(e.target).is(".btn-editar")) {
            e.preventDefault();
            const id = e.target.value;
    
            $.ajax({
                url: $("#form-"+id).attr('action'),
                type: 'put',
                data: $("#form-"+id).serialize(),
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                dataType: 'json',
                success: function (result) {
                    $('#editModal-'+id).modal('hide');
                    $("#alerta-exito").append(result['success']);
                    $("#alerta-exito").show()
                    setTimeout(function () { document.location.reload(true); }, 750);
                }
            });

        } 

        if($(e.target).is(".btn-eliminar")) {
            const id = e.target.value;

            $.ajax({
                url: "/afiliados/"+id,
                type: 'delete',
                data: {
                    id: id
                },
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                dataType: 'json',
                success: function (result) {
                    $('#destroyModal-'+id).modal('hide');
                    $("#alerta-exito").append("<strong>"+result['success']+"</strong>");
                    $("#alerta-exito").show()
                    setTimeout(function () { document.location.reload(true); }, 500);
                }
            });
        }             
    });
});