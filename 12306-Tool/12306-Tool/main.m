//
//  main.m
//  12306-Tool
//
//  Created by 0x00000cc on 2018/12/19.
//  Copyright © 2018 侯猛. All rights reserved.
//

#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        
        // 列车编号 js 文件
        // https://kyfw.12306.cn/otn/resources/js/query/train_list.js
        
        // 火车站名称
        // https://kyfw.12306.cn/otn/resources/js/framework/station_name.js
        
        // 获取文件
        NSString *path = @"/Users/0x00000cc/GitHub/xTeko/12306-Tool/12306-Tool/train_list.js";
        // 将文件数据化
        NSData *data = [[NSData alloc] initWithContentsOfFile:path];
        // 对数据进行JSON格式化并返回字典形式
        id dataTuple = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:nil];
        
        NSDictionary *trainData = dataTuple[@"2019-01-28"];
        
        [trainData enumerateKeysAndObjectsUsingBlock:^(NSString *key, NSArray *obj, BOOL * _Nonnull stop) {
            __block NSMutableDictionary *trainTupleM = [NSMutableDictionary dictionary];
            [obj enumerateObjectsUsingBlock:^(NSDictionary *obj, NSUInteger idx, BOOL * _Nonnull stop) {
                NSString *station_train_code = obj[@"station_train_code"];

                NSUInteger leftLocation = [station_train_code rangeOfString:@"("].location;
                
                NSUInteger centerLocation = [station_train_code rangeOfString:@"-"].location;
                
                NSUInteger rightLocation = [station_train_code rangeOfString:@")"].location;
                
                NSString *train_no = obj[@"train_no"];
                
                NSString *trainCode = [station_train_code substringToIndex:leftLocation];
                
                NSString *departureStation = [station_train_code substringWithRange:NSMakeRange(leftLocation + 1, centerLocation - leftLocation - 1)];
                
                NSString *terminalStation = [station_train_code substringWithRange:NSMakeRange(centerLocation + 1, rightLocation - centerLocation - 1)];
                
                NSDictionary *trainTuple = @{
                                             @"train_no":train_no,
                                             @"trainCode":trainCode,
                                             @"departureStation":departureStation,
                                             @"terminalStation":terminalStation
                                             };
                [trainTupleM setObject:trainTuple forKey:trainCode];
            }];
            
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:trainTupleM options:NSJSONWritingPrettyPrinted error:nil];
            
            NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            
            NSString *path = [NSString stringWithFormat:@"/Users/0x00000cc/GitHub/xTeko/12306-Tool/12306-Tool/%@.json",key];
            if ([jsonString writeToFile:path atomically:true encoding:NSUTF8StringEncoding error:nil]) {
                NSLog(@"%@-写入成功", key);
            }else {
                NSLog(@"%@-写入失败", key);
            }
            
        }];
        
        
        
        
        

    }
    return 0;
}
