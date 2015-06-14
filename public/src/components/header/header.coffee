$ ->
	pathname = document.location.pathname

	target = pathname.split("/")[1];
	console.log target
	if(target == "" || target == "test")
		index = 0

	else if(target == "chat") 
		index = 1

	else if(target == "setting") 
		index = 2

	if(index != undefined)
		nav = $("#header").find(".nav").find("li").removeClass("active");
		$(nav[index]).addClass("active");

	$('#logout').on 'click', ->
		$.ajax({
			type: 'post'
			url: '/signout',
			success: (data)->
				if data.errCode is 200
					setTimeout ->
						window.location.href = '/'
					, 1000
		})