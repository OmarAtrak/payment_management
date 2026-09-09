package com.application.core.shared.utils;

import java.util.Random;

public abstract class RandomUtil {

    public static int  getRandomInt(int min, int max) {
        int random_int = (int) Math.floor(Math.random() * (max - min + 1));
        return random_int;
    }


    public  static  String getRandomString(   int targetStringLength ) {
        int leftLimit = 97; // letter 'a'
        int rightLimit = 122; // letter 'z'
        Random random = new Random();
        String generatedString = random.ints(leftLimit, rightLimit + 1)
                .limit(targetStringLength)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
        return generatedString;
    }



}
