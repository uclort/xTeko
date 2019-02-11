//
//  main.m
//  12306-Tool
//
//  Created by 0x00000cc on 2018/12/19.
//  Copyright © 2018 侯猛. All rights reserved.
//

/// 车次
//#define FunctionType true
/// 站名
#define FunctionType false

#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        
        if (FunctionType) {
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
            
            [dataTuple enumerateKeysAndObjectsUsingBlock:^(id  _Nonnull key, id  _Nonnull obj, BOOL * _Nonnull stop) {
                [obj enumerateKeysAndObjectsUsingBlock:^(NSString *key, NSArray *obj, BOOL * _Nonnull stop) {
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
                    
                    NSString *path = [NSString stringWithFormat:@"/Users/0x00000cc/GitHub/xTeko/12306-Tool/12306-Tool/%@.json",key];
                    
                    // 将文件数据化
                    NSData *oldData = [[NSData alloc] initWithContentsOfFile:path];
                    // 对数据进行JSON格式化并返回字典形式
                    id oldDataTuple = [NSJSONSerialization JSONObjectWithData:oldData options:kNilOptions error:nil];
                    
                    NSMutableDictionary *oldDataTupleM = [[NSMutableDictionary alloc] initWithDictionary:oldDataTuple];
                    
                    [trainTupleM enumerateKeysAndObjectsUsingBlock:^(id  _Nonnull key, id  _Nonnull obj, BOOL * _Nonnull stop) {
                        NSDictionary *trainData = [oldDataTupleM objectForKey:key];
                        if (!trainData) {
                            [oldDataTupleM setValue:obj forKey:key];
                        }
                    }];
                    
                    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:oldDataTupleM options:NSJSONWritingPrettyPrinted error:nil];
                    
                    NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
                    
                    if ([jsonString writeToFile:path atomically:true encoding:NSUTF8StringEncoding error:nil]) {
                        NSLog(@"%@-写入成功", key);
                    }else {
                        NSLog(@"%@-写入失败", key);
                    }
                    
                }];
            }];
            
        } else {
            
            
            // 获取文件
            NSString *path = @"/Users/0x00000cc/GitHub/xTeko/12306-Tool/12306-Tool/station_names.json";
            // 将文件数据化
            NSData *data = [[NSData alloc] initWithContentsOfFile:path];
            // 对数据进行JSON格式化并返回字典形式
            id dataTuple = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:nil];
            
            NSMutableDictionary *pinyinTuple = [NSMutableDictionary dictionary];
            
            [dataTuple enumerateKeysAndObjectsUsingBlock:^(id  _Nonnull key, id  _Nonnull obj, BOOL * _Nonnull stop) {
                //转成了可变字符串
                NSMutableString *str = [NSMutableString stringWithString:key];
                //先转换为带声调的拼音
                CFStringTransform((CFMutableStringRef)str,NULL, kCFStringTransformMandarinLatin,NO);
                //再转换为不带声调的拼音
                CFStringTransform((CFMutableStringRef)str,NULL, kCFStringTransformStripDiacritics,NO);
                //转化为大写拼音
                NSString *pinYin = [[str capitalizedString] substringToIndex:1];
                
                NSMutableArray *pinyinGroup = [NSMutableArray arrayWithArray:[pinyinTuple objectForKey:pinYin]];
                
                [pinyinGroup addObject:key];
                [pinyinTuple setValue:pinyinGroup forKey:pinYin];
                
               
            }];
            
            NSMutableArray *sortGroup = [NSMutableArray array];
            NSMutableArray *indexGroup = [NSMutableArray array];
            
            for (NSString *str in @[@"A",@"B",@"C",@"D",@"E",@"F",@"G",@"H",@"I",@"J",@"K",@"L",@"M",@"N",@"O",@"P",@"Q",@"R",@"S",@"T",@"U",@"V",@"W",@"X",@"Y",@"Z"]) {
                NSArray *sortGroupI = [pinyinTuple objectForKey:str];
                if (sortGroupI) {
                    [sortGroup addObject:@{@"title":str,@"rows":sortGroupI}];
                    [indexGroup addObject:str];
                }
            }
            
            NSDictionary *datatuple = @{@"data":sortGroup,@"index":indexGroup};
            
            NSString *writePath = @"/Users/0x00000cc/GitHub/xTeko/12306-Tool/12306-Tool/station_names_section.json";
            
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:datatuple options:NSJSONWritingPrettyPrinted error:nil];
            
            NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            
            if ([jsonString writeToFile:writePath atomically:true encoding:NSUTF8StringEncoding error:nil]) {
                NSLog(@"写入成功");
            }else {
                NSLog(@"写入失败");
            }
        }
    }
    
    
    return 0;
}
