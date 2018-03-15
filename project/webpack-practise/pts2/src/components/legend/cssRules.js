
/**
 * [addPX] 传入num 处理 输出num+'px'
 * @param {[type]} value [number类型]
 */
export const addPX = function (value) {
	return isNaN(value) ? value : value+'px';
}

export const arrConvertPX = function (value) {
	if ( !Array.isArray(value) ) value = [value];
	return value.map(function(item) {
				return item + 'px';
			}).join(' ');
}

export const handlePosition = function(opt, myChart) {
    var pos = {
      hor: {
        type: 'left',
        value: 0
      },
      ver: {
        type: 'top',
        value: 0
      }
    };

    if (opt.right) {
      pos.hor.type = 'right';
      pos.hor.value = opt.right;
    }

    if (opt.left) {
      pos.hor.type = 'left';
      pos.hor.value = opt.left;
    }

    if (opt.top) {
      pos.ver.type = 'top';
      pos.ver.value = opt.top;
    }

    if (opt.bottom) {
      pos.ver.type = 'bottom';
      pos.ver.value = opt.bottom;
    }

    if ((opt.right && opt.right === 'left') || (opt.left && opt.left === 'left')) {
      pos.hor.type = 'left';
      pos.hor.value = myChart.option.grid.left;
    }

    if ((opt.right && opt.right === 'right')  || (opt.left && opt.left === 'right')) {
      pos.hor.type = 'right';
      pos.hor.value = myChart.option.grid.right;
    }

    if ((opt.right && opt.right === 'center') || (opt.left && opt.left === 'center')) {
      pos.hor.type = 'left';
      pos.hor.value = '50%';
    }   

    if ((opt.top && opt.top === 'top')|| (opt.bottom && opt.bottom === 'top')) {
      pos.ver.type = 'top';
      pos.ver.value = 4;
    }

    if ((opt.top && opt.top === 'bottom') || (opt.bottom && opt.bottom === 'bottom')) {
      pos.ver.type = 'bottom';
      pos.ver.value = 0;
    }

    if ((opt.top && opt.top === 'middle') || (opt.bottom && opt.bottom === 'middle')) {
      pos.ver.type = 'top';
      pos.ver.value = '50%';
    }   

    return pos;
}