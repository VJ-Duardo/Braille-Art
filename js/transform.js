var braille_dic_invert = create_invert_dic();
var braille_dic_90 = create_turn90_dic();
var braille_dic_mirror = create_mirror_dic();


function invert(input_str, dot_for_blank = false) {
    if (dot_for_blank) {
        braille_dic_invert['⣿'] = '⠄';
        braille_dic_invert['⠄'] = '⣿';
    } else {
        braille_dic_invert['⣿'] = '⠀';
        braille_dic_invert['⠄'] = '⢿';
    }

    let result_str = "";
    for (i = 0; i < input_str.length; i++) {
        if (typeof braille_dic_invert[input_str[i]] !== 'undefined') {
            result_str += braille_dic_invert[input_str[i]];
        } else {
            result_str += input_str[i];
        }
    }
    return result_str;
}


function mirror(input_str, dot_for_blank = false) {
    let line_arr = input_str.split(/[ \n]/).filter(Boolean);
    let results_arr = new Array(line_arr.length).fill('');
    for (i = 0; i < line_arr.length; i++) {
        for (j = line_arr[i].length - 1; j >= 0; j--) {
            if (typeof braille_dic_mirror[line_arr[i][j]] !== 'undefined') {
                results_arr[i] += braille_dic_mirror[line_arr[i][j]];
            } else {
                results_arr[i] += line_arr[i][j];
            }
        }
    }

    if (dot_for_blank) {
        return results_arr.join(' ').replace(/[⠀]/g, '⠄');
    } else {
        return results_arr.join(' ');
    }
}


function turn_90(input_str, dot_for_blank = false) {
    let line_arr = input_str.split(/[ \n]/).filter(Boolean);
    if (line_arr.length == 0) {
        return "";
    }
    let longest_line = Math.max(...(line_arr.map(x => x.length)));
    let new_line_arr = new Array(parseInt(longest_line / 2) + longest_line % 2).fill('');

    for (const line of line_arr) {
        if (line == null || line.length < 2) {
            continue;
        }
        let line_chunks = line.match(/.{1,2}/g);
        for (j = 0; j < line_chunks.length; j++) {
            let new_chunk = '';
            if (typeof braille_dic_90[line_chunks[j]] !== 'undefined') {
                new_chunk = braille_dic_90[line_chunks[j]];
            } else {
                if (j == (line_chunks.length) - 1 && line_chunks[j].length == 1) {
                    new_chunk = '';
                } else {
                    new_chunk = line_chunks[j];
                }
            }
            new_line_arr[j] = new_chunk + new_line_arr[j];
        }
    }

    if (dot_for_blank) {
        return new_line_arr.join(' ').replace(/[⠀]/g, '⠄');
    } else {
        return new_line_arr.join(' ');
    }
}
