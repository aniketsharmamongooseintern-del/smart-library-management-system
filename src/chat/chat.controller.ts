import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '@Common';
import { AuthenticatedRequest } from '@Common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ChatDto } from './chat.dto';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async chat(@Body() body: ChatDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user.id;

    return this.chatService.handleMessage(body.message, userId);
  }
}
