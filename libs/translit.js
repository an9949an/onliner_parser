//Если с английского на русский, то передаём вторым параметром true.
var transliterate = (
    function() {
        var
            rus = "Асера Экстрим Спешелайзед Новатрэк Рэйсер Ламборджини Джаинт Гэлакси Электра Куб Центурион Кенондейл Тахое Слик Чик Руки Юбили Калькоф Вояжер Хайбайк Эпик Фуджи Бой Фокус Вистлер Инфинити леди Рози Джаз Роки Юниор Авеню Швин Квест Слайд Жиадао Гринвэй Изи вибрэйк Диск диск Шульц Леди щ   ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф кс ь в к х".split(/ +/g),
            eng = "Acera Extreme Specialized Novatrack Racer Lamborghini Giant Galaxy Electra Cube Centurion Cannondale Tahoe Slik Chik Rookie Jubilee Kalkhoff Voyager Haibike Epic Fuji Boy Focus Whistler Infinity lady Rosy Jazz Rocky Junior Avenue Schwinn Quest Slide Jiadao Greenway Easy V-brake Disc disc Shulz Lady shh sh ch cz yu ya yo zh `` y' e` a b v g d e z i j k l m n o p r s t u f x ` w c h".split(/ +/g)
            ;
        return function(text, engToRus) {
            var x;
            for(x = 0; x < rus.length; x++) {
                text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);
                text = text.split(engToRus ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(engToRus ? rus[x].toUpperCase() : eng[x].toUpperCase());
            }
            return text;
        }
    }
)();