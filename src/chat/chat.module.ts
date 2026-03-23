import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { NlpService } from './nlp.service';
import { LibraryModule } from 'src/library/library.module';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [LibraryModule, AiModule],
  controllers: [ChatController],
  providers: [ChatService, NlpService]
})
export class ChatModule {}
